var context = new window.webkitAudioContext();
var sourceIndex = -1, length = 0;
var sources = [], buffers = [];
var audioBuffer = null;
FileSystem.init();
var audios = [];

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

function initTrack(){
  var tracks = window.currentTrack.info;
  if(tracks){
    for(var i=0; i<tracks.length; i++){

    }
  }
}

function playTrack(){

}

function pauseTrack(){

}

function stopTrack(){

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
      tableItems += '<td><button type="button" onClick = "playSound(' + length + ')" class="glyphicon glyphicon-play-circle" /></td>';
      tableItems += '<td><span onClick = "playSound(' + length + ')" class="glyphicon glyphicon-pause"></span></td>';
      tableItems += '<td><span onClick = "stopSound(' + length + ')" class="glyphicon glyphicon-stop"></span></td>';
      tableItems += '<td><span onClick = "removeSong(' + '&quot;' + escape(f.name) + '&quot;' + ',' + length +')" class="glyphicon glyphicon-remove"></span></td>';
      length++;
      document.getElementById('songList').innerHTML += '<tr id ='+escape(f.name)+' >' + tableItems + '</tr>' ;
  }
}

function createProject(){
  var name = document.getElementById('projectName').value;
  var table = document.getElementById('projectList');
  var rowCount = table.rows.length;

  for(var i=0; i<rowCount; i++) {
    var row = table.rows[i];
      table.deleteRow(i);
           rowCount--;
           i--;
  }
  console.log("great");
  window.currentProject = name;
  var projectName = document.getElementById("currentProject");
  projectName.innerHTML = "";
  projectName.innerHTML = "Current Project: " + name;
  FileSystem.createProject(name);
}

function createTrack(){
  var name = document.getElementById('trackName').value;
  var table = document.getElementById('trackList');
  var rowCount = table.rows.length;
  var found = true;

  var track = {name: name,
              info: []};

  if(found){
     FileSystem.saveTrack(track);
  }
  var el = document.createElement('tr');
  new TrackElement(el, track);
  table.appendChild(el);
  }

function deleteRow(tableID, songName) {
    try {
      console.log(tableID, songName);
      var table = document.getElementById(tableID);
      var rowCount = table.rows.length;
      for(var i=0; i<rowCount; i++) {
        var row = table.rows[i];
        console.log(row.id);
        if(row.id==songName) {
           table.deleteRow(i);
           rowCount--;
           i--;
        }

   }
  }catch(e) {
    alert(e);
  }
}

function removeSong(name, length){
  FileSystem.removeSound(name);
  deleteRow("songList", name)

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

function removeProject(name){

  var table = document.getElementById('projectList');
  var rowCount = table.rows.length;
  var found = true;


  for(var i=0; i<rowCount; i++) {
    var row = table.rows[i];
      table.deleteRow(i);
           rowCount--;
           i--;
  }

    FileSystem.removeProject(name);

}

function getProject(name){

  window.currentProject=name;

  var projectName = document.getElementById("currentProject");
  projectName.innerHTML = "";
  projectName.innerHTML = "Current Project: " + name;
  var table = document.getElementById('projectList');
  var rowCount = table.rows.length;
  var found = true;

  for(var i=0; i<rowCount; i++) {
    var row = table.rows[i];
      table.deleteRow(i);
           rowCount--;
           i--;
  }

  table = document.getElementById('trackList');
  rowCount = table.rows.length;
  found = true;

  for(var i=0; i<rowCount; i++) {
    row = table.rows[i];
      table.deleteRow(i);
           rowCount--;
           i--;
  }

  table = document.getElementById('songList');
  rowCount = table.rows.length;
  found = true;

  for(var i=0; i<rowCount; i++) {
    row = table.rows[i];
      table.deleteRow(i);
           rowCount--;
           i--;
  }


  FileSystem.createProject(name);
  FileSystem.getProject(name);

}

function loadProjectsFromFileSystem(evt){
  var projects = evt.detail; // FileList object
  // files is a FileList of File objects. List some properties.
  for (var i = 0, p; p = projects[i]; i++) {
      var contents='<tr id ='+p+' >' + "<td>"+ p+"</td>";
      contents+= '<td><span onClick = "getProject(' + '&quot;' + p + '&quot;'+')" class="glyphicon glyphicon-upload"></span></td>';
      contents+= '<td><span onClick = "removeProject(' + '&quot;' + p + '&quot;'+')" class="glyphicon glyphicon-remove"></span></td>';
      contents+= '</tr>' ;
      document.getElementById('projectList').innerHTML +=contents;
  }
}

function loadTracksFromFileSystem(evt){
  var tracks = evt.detail; // FileList object
  // files is a FileList of File objects. List some properties.
  var table = document.getElementById('trackList');
  for (var index in tracks) {
    (function(file) {
      var el = document.createElement('tr');
      new TrackElement(el, file);
      table.appendChild(el);
    }(tracks[index]);
    
  }
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
window.addEventListener('filesPulled', loadFromFileSystem, false);
window.addEventListener('projectsPulled', loadProjectsFromFileSystem, false);
window.addEventListener('tracksPulled', loadTracksFromFileSystem, false);