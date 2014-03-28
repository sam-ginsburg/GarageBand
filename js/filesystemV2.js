window.FileSystem2 = (function(){
	'use strict';

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	var myGrantedBytes = null;

	navigator.webkitPersistentStorage.requestQuota(100*1024*1024, function(grantedBytes) {
		myGrantedBytes = grantedBytes;
	}, function(e) {
		console.log('Error: Could not get storage quota.', e);
	});

	var FileSystem = {

		init: function() {
			var sayhi = function(thing){
				console.log("hey broski");
				console.log(thing);
			};
			//toGetTrack("DefaultProject", "SamsTrack", sayhi);

			//toGetAllTracks("DefaultProject", sayhi);
		},

		createProject: function(projName) {

		},

		saveNewTrack: function(projName, track) {

		},

		saveSounds: function(projName, FilesList) {

		},

		getAllProjectNames: function() {
			toGetAllProjectNames(function(allProjNames){
				window.dispatchEvent(new CustomEvent('allProjNamesPulled', {detail: allProjNames}));
			});
		},

		getSound: function(projName, soundName) {
			toGetSound(projName, soundName, function(sound){
				window.dispatchEvent(new CustomEvent('soundPulled', {detail: sound}));
			});
		},

		getAllSounds: function(projName) {
			toGetAllSounds(projName, function(allSounds){
				window.dispatchEvent(new CustomEvent('allSoundsPulled', {detail: allSounds}));
			});
		},

		getTrack: function(projName, trackName) {
			toGetTrack(projName, trackName, function(track){
				window.dispatchEvent(new CustomEvent('trackPulled', {detail: track}));
			});
		},

		getAllTracks: function(projName) {
			toGetAllTracks(projName, function(allTracks){
				window.dispatchEvent(new CustomEvent('allTracksPulled', {detail: allTracks}));
			});
		},

		updateTrack: function(projName, trackName) {

		},

		removeSound: function(projName, soundName) {

		},

		removeProject: function(projName) {

		},

		removeTrack: function(projName, trackName) {

		},

		printfiles: function(event) {
			console.log(event.detail);
		}
	};

	function getFS(success) {
		window.requestFileSystem(window.PERSISTENT, myGrantedBytes, function(fs){
			success(fs);
		}, errorHandler);
	}

	function getProject(projName, success) {
		getFS(function(fs) {
			fs.root.getDirectory(projName, {create: false}, function(dirEntry) {
				success(dirEntry);
			}, errorHandler);
		});
	}

	function toGetAllProjectNames(success) {
		getFS(function(fs){
			var allProjNames = [];
			var dirReader = fs.root.createReader();
			dirReader.readEntries (function(results) {
				for(var i=0; i<results.length; i++){
					allProjNames.push(results[i].name);
				}
				success(allProjNames);
			}, errorHandler);
		});
	}

	function getTracksDir(projName, success) {
		getProject(projName, function(projDir){
			projDir.getDirectory("Tracks", {create: false, exclusive: true}, function(dirEntry) {
				success(dirEntry);
			}, errorHandler);
		});
	}

	function toGetTrackFile(projName, trackName, success) {
		getTracksDir(projName, function(tracksDir){
			tracksDir.getFile(trackName, {create: false}, function(fileEntry) {
				success(fileEntry);
			}, errorHandler);
		});
	}

	function toGetTrack(projName, trackName, success) {
		toGetTrackFile(projName, trackName, function(trackFile){
			trackFileToObj(trackFile, function(track){
				success(track);
			});
		});
	}

	function getSoundsDir(projName, success) {
		getProject(projName, function(projDir){
			projDir.getDirectory("Sounds", {create: false, exclusive: true}, function(dirEntry) {
				success(dirEntry);
			}, errorHandler);
		});
	}

	function toGetSoundFile(projName, soundName, success) {
		getSoundsDir(projName, function(soundsDir){
			soundsDir.getFile(soundName, {create: false}, function(fileEntry) {
				success(fileEntry);
			}, errorHandler);
		});
	}

	function toGetSound(projName, soundName, success) {
		toGetSoundFile(projName, soundName, function(soundFile){
			soundFileToObj(soundFile, function(sound){
				success(sound);
			});
		});
	}

	function soundFileToObj(soundFile, success) {
		soundFile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				success({name: file.name, buffer: this.result});
			};

			reader.readAsArrayBuffer(file);
		}, errorHandler);
	}

	function trackFileToObj(trackFile, success) {
		trackFile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				success(JSON.parse(this.result));
			};

			reader.readAsText(file);
		}, errorHandler);
	}

	function toGetAllSoundFiles(projName, success) {
		getSoundsDir(projName, function(soundsDir){
			var dirReader = soundsDir.createReader();
			var entries = [];

			dirReader.readEntries (function(results) {
				entries = entries.concat(toArray(results));
				success(entries);
			}, errorHandler);
		});
	}

	function toGetAllSounds(projName, success) {
		toGetAllSoundFiles(projName, function(fileEntries){
			var soundArray = [];
			for(var i = 0; i<fileEntries.length; i++){
				soundFileToObj(fileEntries[i], function(sound){
					soundArray.push(sound);
					if(soundArray.length == fileEntries.length){
						success(soundArray);
					}
				});
			}
		});
	}

	function toGetAllTrackFiles(projName, success) {
		getTracksDir(projName, function(tracksDir){
			var dirReader = tracksDir.createReader();
			var entries = [];

			dirReader.readEntries (function(results) {
				entries = entries.concat(toArray(results));
				success(entries);
			}, errorHandler);
		});
	}

	function toGetAllTracks(projName, success) {
		toGetAllTrackFiles(projName, function(fileEntries){
			var trackArray = [];
			for(var i = 0; i<fileEntries.length; i++){
				trackFileToObj(fileEntries[i], function(track){
					trackArray.push(track);
					if(trackArray.length == fileEntries.length){
						success(trackArray);
					}
				});
			}
		});
	}

	function toArray(list) {
		return Array.prototype.slice.call(list || [], 0);
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

	return FileSystem;
})();