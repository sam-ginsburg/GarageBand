window.FileSystem = (function(){
	'use strict';

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	var myGrantedBytes = null;
	var fileListToSave = null;
	var trackToSave = null;
	var filesOut = null;
	var fileToRemove = null;
	var projectName = null;
	var trackName = null;
	var curSoundDir = null;
	var curTrackDir = null;
	//var currentProject;

	if(window.currentProject === undefined){
		window.currentProject = null;
	}

	if(window.currentTrack === undefined){
		window.currentTrack = null;
	}

	navigator.webkitPersistentStorage.requestQuota(100*1024*1024, function(grantedBytes) {
		myGrantedBytes = grantedBytes;
		window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
	}, function(e) {
		console.log('Error', e);
	});

	var FileSystem = {

		createProject: function(name){  // changed to string from event
			projectName = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toCreateProject, errorHandler);
			// window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toSetUpProject, errorHandler);
		},

		init: function() {
			this.getFirstProject();

			window.addEventListener('filesLoaded', this.save);
			// window.addEventListener('requestFiles', this.load);
			window.addEventListener('filesPulled', this.printfiles);
			window.addEventListener('projectsPulled', this.printfiles);
			// window.addEventListener('projectCreated', this.getProject);

			//this.load();
		},

		getFirstProject: function(){
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetFirstProject, errorHandler);
		},

		getProject: function(name){   // recently changed to string from name
			projectName = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetProject, errorHandler);
		},

		getTrack: function(name) {
			trackName = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetTrack, errorHandler);
		},

		updateTrack: function(name) {

		},

		load: function(){
			console.log("loading");
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetFiles, errorHandler);
		},

		save: function(event) {
			var filesList = event.detail;
			fileListToSave = filesList;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toSaveFiles, errorHandler);
		},

		saveTrack: function(track) {
			trackToSave = track;
			currentTrack = track;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toSaveTrack, errorHandler);
		},

		removeSound: function(name) {
			fileToRemove = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toRemoveFile, errorHandler);
		},

		removeProject: function(name) {
			fileToRemove = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toRemoveProject, errorHandler);
		},

		removeTrack: function(name) {

		},

		printfiles: function(event) {
			console.log(event.detail);
		}
	};

	function onInitFs(fs) {
// do nothing
}

function errorHandler(e) {
	var msg = '';

	switch (e.code) {
		case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
		case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
		case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
		case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
		case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
		default:
		msg = 'Unknown Error';
		break;
	}

	console.log('Error: ' + msg);
}

function toArray(list) {
	return Array.prototype.slice.call(list || [], 0);
}

function setProject(dirEntry){
	window.currentProject = dirEntry;
}

function toCreateDefaultDirectory(fs){
	fs.root.getDirectory('DefaultProject', {create: true, exclusive: true}, function(dirEntry) {
		setProject(dirEntry);
		FileSystem.getFirstProject();
  }, errorHandler);
}

function toCreateProject(fs){
	fs.root.getDirectory(projectName, {create: true, exclusive: true}, function(dirEntry) {
		setProject(dirEntry);
		// FileSystem.getProject(dirEntry.name);
		// window.dispatchEvent(new CustomEvent('projectCreated', {detail: dirEntry.name}));
		toSetUpProject();
  }, errorHandler);
}

function toSetUpProject(){
	currentProject.getDirectory("Sounds", {create: true, exclusive: true}, function(dirEntry) {
		curSoundDir = dirEntry;
		// FileSystem.getProject(projectName);

		currentProject.getDirectory("Tracks", {create: true, exclusive: true}, function(dirEntry2) {
			curTrackDir = dirEntry2;
			FileSystem.getProject(projectName);
		}, errorHandler);

	}, errorHandler);

}

function toSaveFiles(fs){
	for (var i = 0, file; file = fileListToSave[i]; ++i) {

		(function(f) {
			curSoundDir.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {//fs.root. //currentProject.
				fileEntry.createWriter(function(fileWriter) {

					fileWriter.onwriteend = function(e) {
						if(i === fileListToSave.length){
							console.log('Write completed.');
							window.dispatchEvent(new CustomEvent('filesSaved', {detail: fileListToSave}));
						}
					};
            // var buffs = [];
            // buffs.push(f.buffer);
            // var blob = new Blob(buffs);
            fileWriter.write(f); // Note: write() can take a File or Blob object.
        }, errorHandler);
			}, errorHandler);
		})(file);
	}
	// var a = new CustomEvent('filesSaved', {detail: fileListToSave});
	// window.dispatchEvent(a);

}

function toSaveTrack(fs) {
	curTrackDir.getFile(trackToSave.name, {create: true, exclusive: true}, function(fileEntry){
		fileEntry.createWriter(function(fileWriter) {

			fileWriter.onwriteend = function(e) {
				console.log('Track write completed.');
			};

			fileWriter.onerror = function(e) {
				console.log('Track write failed: ' + e.toString());
			};

			// Create a new Blob and write it to log.txt.
			var blob = new Blob([JSON.stringify(trackToSave)], {type: 'text/plain'});

			fileWriter.write(blob);

		}, errorHandler);
	}, errorHandler);
}

function toRemoveFile(fs){
	curSoundDir.getFile(fileToRemove, {create: false}, function(fileEntry) { //currentProject.

    fileEntry.remove(function() {
      console.log('File removed.');
      window.dispatchEvent(new CustomEvent('fileDeleted', {detail: fileEntry}));
    }, errorHandler);

  }, errorHandler);
}

function toGetFiles(fs){

	var dirReader = curSoundDir.createReader();//fs.root. //currentProject.
	var dirReaderTracks = curTrackDir.createReader();
	var dirReaderProjs = fs.root.createReader();

	var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
	dirReader.readEntries (function(results) {

		entries = entries.concat(toArray(results));
		filesOut = convertToObjs(entries);

	}, errorHandler);

	dirReaderProjs.readEntries (function(results) {

		var res = [];
		for(var i=0; i<results.length; i++){
			res.push(results[i].name);
		}

		window.dispatchEvent(new CustomEvent('projectsPulled', {detail: res}));

	}, errorHandler);

	dirReaderTracks.readEntries (function(results) {
		var trackentries = [];
		trackentries = trackentries.concat(toArray(results));
		filesOut = tracksToJSON(trackentries);

	}, errorHandler);

  };

  readEntries();

}

function toGetFirstProject(fs){

	var dirReader = fs.root.createReader();//fs.root.

	var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
	dirReader.readEntries (function(results) {

		entries = entries.concat(toArray(results));
		window.currentProject = entries[0];

		if(currentProject !== undefined && currentProject !== null){
			currentProject.getDirectory('Sounds', {create: false}, function(dirEntry) {
				curSoundDir = dirEntry;

				currentProject.getDirectory("Tracks", {create: false, exclusive: true}, function(dirEntry2) {
					curTrackDir = dirEntry2;
					FileSystem.load();
				}, errorHandler);

				// FileSystem.load();
			}, errorHandler);
			// FileSystem.load();
			// window.dispatchEvent(new CustomEvent('projectFound', {detail: null}));
		}
		else{
			FileSystem.createProject("DefaultProject");
		}

	}, errorHandler);

  };

  readEntries();

}

function toGetProject(fs){

	fs.root.getDirectory(projectName, {create: false}, function(dirEntry) {
		currentProject = dirEntry;
		if(currentProject !== null){
			currentProject.getDirectory('Sounds', {create: false}, function(dirEntry) {
				curSoundDir = dirEntry;

				currentProject.getDirectory("Tracks", {create: false, exclusive: true}, function(dirEntry2) {
					curTrackDir = dirEntry2;
					FileSystem.load();
				}, errorHandler);

				// FileSystem.load();
			}, errorHandler);
			// FileSystem.load();
			// window.dispatchEvent(new CustomEvent('projectFound', {detail: null}));
		}
  }, errorHandler);

}

function toGetTrack(fs){
	currentProject.getDirectory("Tracks", {create: false, exclusive: true}, function(dirEntry) {
		dirEntry.getFile(trackName, {create: false}, function(fileEntry) {

			fileEntry.file(function(file) {
				var reader = new FileReader();

				reader.onloadend = function(e) {
					var reconTrack = JSON.parse(this.result);
					currentTrack = reconTrack;
					console.log(currentTrack);
					window.dispatchEvent(new CustomEvent('trackChanged', {detail: reconTrack}));

				};

				reader.readAsText(file);
			}, errorHandler);

		}, errorHandler);
	}, errorHandler);
}

function toRemoveProject(fs){
	fs.root.getDirectory(fileToRemove, {create: false}, function(dirEntry) {

		dirEntry.removeRecursively(function() {
			console.log('Project removed.');
			if(fileToRemove === currentProject.name){
				currentProject = undefined;
				FileSystem.getFirstProject();
			}
			window.dispatchEvent(new CustomEvent('projectDeleted', {detail: dirEntry}));
		}, errorHandler);

	}, errorHandler);
}

function convertToObjs(fileentries){
	var res = [];

	for(var i = 0; i<fileentries.length; i++){
		var curfile = fileentries[i];

		curfile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				// console.log(file.name);
				res.push({name: file.name, buffer: this.result});
				if(res.length == fileentries.length){
					filesOut = res;
					var d = new CustomEvent('filesPulled', {detail: filesOut});
					window.dispatchEvent(d);
				}
			};

			reader.readAsArrayBuffer(file);
		}, errorHandler);
	}
}

function tracksToJSON(fileentries){
	var res = [];
	var reconTrack = {};

	for(var i = 0; i<fileentries.length; i++){
		var curfile = fileentries[i];

		curfile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				reconTrack = JSON.parse(this.result);
				res.push(reconTrack);
				if(res.length == fileentries.length){
					window.dispatchEvent(new CustomEvent('tracksPulled', {detail: res}));
					// console.log(res);
				}
			};

			reader.readAsText(file);
		}, errorHandler);
	}
}

return FileSystem;
})();