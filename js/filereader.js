var context = new window.webkitAudioContext();
var sources = [], buffers = [];
var audioBuffer = null;
var firstload = true;
FileSystem.init();

// Read in sound files and add them to the list
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  files = Array.prototype.filter.call(files, function filterer(f){console.log(f.type); if(f.type == "audio/mp3" || f.type == "audio/ogg" || f.type == "audio/wav") return true; else{return false;}});
  var a = new CustomEvent('filesLoaded', {detail: files});
  window.dispatchEvent(a);

  var table = document.getElementById('songList');
  // files is a FileList of File objects. List some properties.
  for (var i = 0, f; f = files[i]; i++) {
    var output = [];
    var reader = new FileReader();
    var source;

    reader.onload = (function(theFile){
      var fileName = theFile.name;
      return function(f){
        context.decodeAudioData(this.result, function(audio) {
          var sound = {
            audio: audio,
            name: fileName};
            var el = document.createElement('tr');
            new SoundElement(el, sound);
            table.appendChild(el);
          });
      };
    })(f);
    reader.readAsArrayBuffer(f);
  }
  initColumns();
}

function createProject(){
  var name = document.getElementById('projectName').value;
  var table = document.getElementById('projectList');
  var rowCount = table.rows.length;
    var trackTable = document.getElementById('track-display');
  trackTable.innerHTML = "";

  for(var i=0; i<rowCount; i++) {
    var row = table.rows[i];
    table.deleteRow(i);
    rowCount--;
    i--;
  }
  window.currentProject = name;
  var projectName = document.getElementById("currentProject");
  projectName.innerHTML = "";
  projectName.innerHTML = "Current Project: " + name;
  FileSystem.createProject(name);
}

function createTrack(){

  var n = document.getElementById('trackName').value;
 // var table = document.getElementById('trackList');
  //var rowCount = table.rows.length;
  var found = true;
  var track = {name: n,
    info: []};
    if(found){
      FileSystem.saveTrack(track);
    }

  var table = document.getElementById('track-display');
  var i = 0;
  var el = document.createElement('div');
  new TrackEditorElement(el, "test",n);
  table.appendChild(el);

 // var el = document.createElement('tr');
 // new TrackElement(el, track);
  //table.appendChild(el);
  //initColumns();
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
  initColumns();
}

// function showTracksFromFileSystem() {
//   for( var project in ProjectManager.project_hash){
//     console.log(FileSystem2.getAllTracks(project));
//   }
//   var table = document.getElementById('track-display');
//   var i = 0;
//   for (i = 0;i <3; i++) {
//         var el = document.createElement('div');
//         new TrackEditorElement(el, "swag");
//         table.appendChild(el);
//   }
// }

function getProject(name){
  FileSystem.createProject(name);
  FileSystem.getProject(name);
}

function loadProjectsFromFileSystem(evt){
  var projects = evt.detail;
  if(firstload){
    var header = document.getElementById('currentProject');
    header.innerHTML = "Current Project: " + evt.detail[0];
    firstload = false;
  }
  var table = document.getElementById('projectList');
  for (var index in projects) {
    (function(project) {
      var el = document.createElement('tr');
      new ProjectElement(el, project);
      table.appendChild(el);
    })(projects[index]);
  }
}

function loadTracksFromFileSystem(evt){
  // var tracks = evt.detail; // FileList object
  // // files is a FileList of File objects. List some properties.
  // var table = document.getElementById('trackList');
  // for (var index in tracks) {
  //   (function(file) {
  //     var el = document.createElement('tr');
  //     new TrackElement(el, file);
  //     table.appendChild(el);
  //   })(tracks[index]);
  // }

  var tracks = evt.detail;

  var table = document.getElementById('track-display');
  table.innerHTML = "";
  var i = 0;
  for (i = 0;i <tracks.length; i++) {
        var el = document.createElement('div');
        new TrackEditorElement(el, "test",tracks[i].name);
        table.appendChild(el);
  }
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
window.addEventListener('filesPulled', loadFromFileSystem, false);
window.addEventListener('projectsPulled', loadProjectsFromFileSystem, false);
window.addEventListener('tracksPulled', loadTracksFromFileSystem, false);