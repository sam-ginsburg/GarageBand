var context = new window.webkitAudioContext();
var source = null;
var audioBuffer = [];
var numSongs = 0;

function playSound(songNum) {
  // source is global so we can call .noteOff() later.
  source = context.createBufferSource();
  source.buffer = audioBuffer[songNum];
  source.loop = false;
  source.connect(context.destination);
  source.noteOn(0); // Play immediately.
}

function stopSound() {
  if (source) {
    source.stop(0);
  }
}

function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    // audioBuffer is global to reuse the decoded audio later.
    audioBuffer[numSongs] = buffer;
    numSongs++;
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}

// Read in sound files and add them to the list
 function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    var list = document.getElementById('list');
    for (var i = 0, f; f = files[i]; i++) {


      var reader = new FileReader();
      output.push('<td><strong>', escape(f.name), '</strong> ','</td>');

      reader.onload = function(e) {
        initSound(this.result);
      };

      reader.readAsArrayBuffer(f);

      var tableItems = output.join('')
      tableItems += '<td><span onClick = "playSound(' + numSongs + ')" class="glyphicon glyphicon-play-circle"></span></td>'
      tableItems += '<td><span onClick = "stopSound()" class="glyphicon glyphicon-stop"></span></td>'
      list.innerHTML += '<tr>' + tableItems + '</tr>' ;

    }


  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);