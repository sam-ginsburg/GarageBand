var context = new window.webkitAudioContext();
var sourceIndex = -1;
var sources = [];
var audioBuffer = null;
var buffers = [];

FileSystem.init();

function playSound(index) {
  // source is global so we can call .noteOff() later.
  stopSound();
  sourceIndex = index;
  sources[index].noteOn(0); // Play immediately.
  return index;
}

function stopSound() {
  if (sourceIndex != -1) {
    sources[sourceIndex].noteOff(0);
    sources[sourceIndex] = context.createBufferSource();
    sources[sourceIndex].buffer = buffers[sourceIndex];
    sources[sourceIndex].loop = false;
    sources[sourceIndex].connect(context.destination);
  }
  sourceIndex = -1;
  return -1;
}

function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    // audioBuffer is global to reuse the decoded audio later.
    audioBuffer = buffer;
    buffers.push(audioBuffer);
    var source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;
    source.connect(context.destination);
    sources.push(source);
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

// Read in sound files and add them to the list
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  files = Array.prototype.filter.call(files, function filterer(f){console.log(f.type); if(f.type == "audio/mp3" || f.type == "audio/ogg" || f.type == "audio/wav") return true; else{return false;}});
  console.log("LOOK AT THIS", files);
  var a = new CustomEvent('filesLoaded', {detail: files});
  window.dispatchEvent(a);

  // files is a FileList of File objects. List some properties.
  for (var i = 0, f; f = files[i]; i++) {
      var output = [];
      var reader = new FileReader();
      output.push('<td><strong>', escape(f.name), '</strong> ','</td>');

      reader.onload = function(e) {
       initSound(this.result);
      };

      reader.readAsArrayBuffer(f);

      var tableItems = output.join('');
      tableItems += '<td><span onClick = "playSound(' + buffers.length + ')" class="glyphicon glyphicon-play-circle"></span></td>';
      tableItems += '<td><span onClick = "stopSound()" class="glyphicon glyphicon-stop"></span></td>';
      document.getElementById('list').innerHTML += '<tr>' + tableItems + '</tr>' ;
  }

}

 function loadFromFileSystem(evt) {
  var arrayAndName = evt.detail;
  for (var i = 0, f; f = arrayAndName[i]; i++) {
    var output = [];
    var name = f.name;

    console.log(name);
    var arrayBuffer = f.buffer;
    output.push('<td><strong>', name, '</strong> ','</td>');

   
    initSound(arrayBuffer);

    var tableItems = output.join('');
    tableItems += '<td><span onClick = "playSound(' + buffers.length + ')" class="glyphicon glyphicon-play-circle"></span></td>';
    tableItems += '<td><span onClick = "stopSound()" class="glyphicon glyphicon-stop"></span></td>';
    document.getElementById('list').innerHTML += '<tr>' + tableItems + '</tr>';

  }

   
 }
 document.getElementById('files').addEventListener('change', handleFileSelect, false);
 window.addEventListener('filesPulled', loadFromFileSystem, false);
