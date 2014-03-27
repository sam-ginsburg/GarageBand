window.FileSystem = (function(){
	'use strict';

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	var myGrantedBytes = null;
	var fileListToSave = null;
	var filesOut = null;
	var fileToRemove = null;
	var projectName = null;
	//var currentProject;

	if(window.currentProject === undefined){
		window.currentProject = null;
	}

	window.webkitStorageInfo.requestQuota(window.PERSISTENT, 50*1024*1024, function(grantedBytes) {
		myGrantedBytes = grantedBytes;
		window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
	}, function(e) {
		console.log('Error', e);
	});

	var FileSystem = {

		createProject: function(event){
			console.log(event);
			projectName = event.detail;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toCreateProject, errorHandler);
		},

		init: function() {
			this.getFirstProject();

			window.addEventListener('filesLoaded', this.save);
			window.addEventListener('requestFiles', this.load);
			window.addEventListener('filesPulled', this.printfiles);
			// window.addEventListener('deleteFile', this.remove);
			window.addEventListener('projectFound', this.load);
			window.addEventListener('projectCreated', this.getProject);

			//window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toCreateDirectory, errorHandler);

			//this.load();
		},

		getFirstProject: function(){
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetFirstProject, errorHandler);
		},

		getProject: function(event){
			projectName = event.detail;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetProject, errorHandler);
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

		removeSound: function(name) {
			fileToRemove = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toRemoveFile, errorHandler);
		},

		removeProject: function(name) {
			fileToRemove = name;
			window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toRemoveProject, errorHandler);
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
		window.dispatchEvent(new CustomEvent('projectCreated', {detail: dirEntry.name}));
  }, errorHandler);
}

function toSaveFiles(fs){
	for (var i = 0, file; file = fileListToSave[i]; ++i) {

		(function(f) {
			currentProject.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {//fs.root.
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

function toRemoveFile(fs){
	currentProject.getFile(fileToRemove, {create: false}, function(fileEntry) {

    fileEntry.remove(function() {
      console.log('File removed.');
      window.dispatchEvent(new CustomEvent('fileDeleted', {detail: fileEntry}));
    }, errorHandler);

  }, errorHandler);
}

function toGetFiles(fs){

	var dirReader = currentProject.createReader();//fs.root.

	var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
	dirReader.readEntries (function(results) {

		entries = entries.concat(toArray(results));
		filesOut = convertToObjs(entries);

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
			window.dispatchEvent(new CustomEvent('projectFound', {detail: null}));
		}
		else{
			FileSystem.createProject({detail: "DefaultProject"});
		}

	}, errorHandler);

  };

  readEntries();

}

function toGetProject(fs){

	fs.root.getDirectory(projectName, {create: false}, function(dirEntry) {
		currentProject = dirEntry;
		if(currentProject !== null){
			window.dispatchEvent(new CustomEvent('projectFound', {detail: null}));
		}
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

		//if(curfile.)
		console.log(typeof curfile);

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

return FileSystem;
})();