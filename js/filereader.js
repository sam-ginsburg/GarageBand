var context = new window.webkitAudioContext();
var sourceIndex = -1, length = 0;
var sources = [], buffers = [];
var audioBuffer = null;
FileSystem.init();

function playSound(index) { 
  // source is global so we can call .noteOff() later.
  if(sources[index]){
    stopSound(index, true);
    sourceIndex = index;
    sources[index].noteOn(0); // Play immediately.
  }
  return index;
}

function stopSound(index, bool) {
  if (sourceIndex != -1 && (index == sourceIndex || bool)) {
    sources[sourceIndex].noteOff(0);
    sources[sourceIndex] = context.createBufferSource();
    sources[sourceIndex].buffer = buffers[sourceIndex];
    sources[sourceIndex].loop = false;
    sources[sourceIndex].connect(context.destination);
    sourceIndex = -1;
  }
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
      console.log(buffers.length);
      tableItems += '<td><span onClick = "playSound(' + length + ')" class="glyphicon glyphicon-play-circle"></span></td>';
      tableItems += '<td><span onClick = "stopSound(' + length + ')" class="glyphicon glyphicon-stop"></span></td>';
      tableItems += '<td><span onClick = "removeSong(' + '&quot;' + escape(f.name) + '&quot;' + ',' + length +')" class="glyphicon glyphicon-remove"></span></td>';
      length++;
      document.getElementById('songList').innerHTML += '<tr>' + tableItems + '</tr>' ;
  }
}

function createProject(){
  var name = document.getElementById('projectName').value;
  var ev = new CustomEvent('newProject', {detail: name});
  FileSystem.createProject(ev);

}

function removeSong(name, length){
  FileSystem.removeSound(name);

}

function loadFromFileSystem(evt) {
  var arrayAndName = evt.detail;
  var table = document.getElementById('songList');
  for (var index in arrayAndName) {
    (function(file) {
      context.decodeAudioData(file.buffer, function(audio) {
        file.audio = audio;
        var el = document.createElement('tr');
        new SoundElement(el, file);
        table.appendChild(el);
      });
    })(arrayAndName[index]);
  }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
window.addEventListener('filesPulled', loadFromFileSystem, false);
