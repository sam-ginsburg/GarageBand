window.FileSystem2 = (function(){
	'use strict';

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	navigator.webkitPersistentStorage.requestQuota(100*1024*1024, function(grantedBytes) {
		window.myGrantedBytes = grantedBytes;
	}, function(e) {
		console.log('Error: Could not get storage quota.', e);
	});

	var FileSystem = {

		init: function() {

			window.addEventListener('filesLoaded', this.testSaveHelper);
			window.addEventListener('soundsSaved', function(){
			});

			var sayhi = function(thing){
				console.log("hey broski");
				console.log(thing);
			};
			//toGetTrack("DefaultProject", "SamsTrack", sayhi);

			//toGetAllTracks("DefaultProject", sayhi);
		},

		testSaveHelper: function(event) { //dont use this function; just used for testing
			var filesList = event.detail;
			console.log("temp helper test");
			FileSystem2.saveSounds("DefaultProject", filesList);
		},

		createProject: function(projName) {
			toCreateProject(projName, function(){
				window.dispatchEvent(new CustomEvent('projectCreated'));
			});
		},

		createTrack: function(projName, track) {
			toCreateTrack(projName, track, function(){
				window.dispatchEvent(new CustomEvent('trackCreated'));
			});
		},

		saveSounds: function(projName, filesList) {
			toSaveSounds(projName, filesList, function(){
				window.dispatchEvent(new CustomEvent('soundsSaved'));
			});
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
			toRemoveSound(projName, soundName, function(){
				window.dispatchEvent(new CustomEvent('soundRemoved'));
			});
		},

		removeProject: function(projName) {
			toRemoveProject(projName, function(){
				window.dispatchEvent(new CustomEvent('projectRemoved'));
			});
		},

		removeTrack: function(projName, trackName) {
			toRemoveTrack(projName, trackName, function(){
				window.dispatchEvent(new CustomEvent('trackRemoved'));
			});
		},

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

	function toSaveSounds(projName, filesList, success) {
		getSoundsDir(projName, function(soundsDir){
			for (var i = 0, file; file = filesList[i]; ++i) {

				(function(f) {
					soundsDir.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
						fileEntry.createWriter(function(fileWriter) {

							fileWriter.onwriteend = function(e) {
								if(i === filesList.length){
									console.log('Sound write completed.');
									success();
								}
							};
							fileWriter.write(f);
						}, errorHandler);
					}, errorHandler);
				})(file);
			}
		});
	}

	function toCreateTrack(projName, track, success) {
		getTracksDir(projName, function(tracksDir){
			tracksDir.getFile(track.name, {create: true, exclusive: true}, function(fileEntry){
				fileEntry.createWriter(function(fileWriter) {

					fileWriter.onwriteend = function(e) {
						console.log('Track write completed.');
						success();
					};

					fileWriter.onerror = function(e) {
						console.log('Track write failed: ' + e.toString());
					};

					var blob = new Blob([JSON.stringify(track)], {type: 'text/plain'});

					fileWriter.write(blob);

				}, errorHandler);
			}, errorHandler);
		});
	}

	function makeDirectory(parentDir, name, success) {
		parentDir.getDirectory(name, {create: true, exclusive: true}, function(dirEntry) {
			success(dirEntry);
		}, errorHandler);
	}

	function toCreateProject(projName, success) {
		getFS(function(fs){
			makeDirectory(fs.root, projName, function(projDir){
				makeDirectory(projDir, "Sounds", function(soundsDir){
					makeDirectory(projDir, "Tracks", function(tracksDir){
						success();
					});
				});
			});
		});
	}

	function removeFile(parentDir, name, success) {
		parentDir.getFile(name, {create: false}, function(fileEntry) {

			fileEntry.remove(function() {
				console.log('File ' + name + ' removed.');
			}, errorHandler);

		}, errorHandler);
	}

	function toRemoveSound(projName, soundName, success) {
		getSoundsDir(projName, function(soundsDir){
			removeFile(soundsDir, soundName, function(){
				success();
			});
		});
	}

	function toRemoveTrack(projName, trackName, success) {
		getTracksDir(projName, function(tracksDir){
			removeFile(tracksDir, trackName, function(){
				success();
			});
		});
	}

	function toRemoveProject(projName, success) {
		getFS(function(fs){
			fs.root.getDirectory(projName, {create: false}, function(dirEntry) {

				dirEntry.removeRecursively(function() {
					console.log('Project ' + projName + ' removed.');
					success();
				}, errorHandler);

			}, errorHandler);
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