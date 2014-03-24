window.FileSystem = (function(){
'use strict';

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

var myGrantedBytes = null;
var fileListToSave = null;
var filesOut = null;

window.webkitStorageInfo.requestQuota(window.PERSISTENT, 50*1024*1024, function(grantedBytes) {
	myGrantedBytes = grantedBytes;
	window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
}, function(e) {
	console.log('Error', e);
});

var FileSystem = {
	init: function() {
		window.addEventListener('filesLoaded', this.save);
		window.addEventListener('requestFiles', this.load);
		window.addEventListener('filesPulled', this.printfiles);
		this.load();
	},

	load: function(){
		window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetFiles, errorHandler);
	},

	save: function(event) {
		var filesList = event.detail;
		fileListToSave = filesList;
		window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toSaveFiles, errorHandler);
	},

	remove: function() {
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

function toSaveFiles(fs){
  for (var i = 0, file; file = fileListToSave[i]; ++i) {

    (function(f) {
      fs.root.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            // var buffs = [];
            // buffs.push(f.buffer);
            // var blob = new Blob(buffs);
            fileWriter.write(f); // Note: write() can take a File or Blob object.
          }, errorHandler);
      }, errorHandler);
    })(file);
  }
  var a = new CustomEvent('filesSaved', {detail: fileListToSave});
  window.dispatchEvent(a);

}

function toGetFiles(fs){

  var dirReader = fs.root.createReader();

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

return FileSystem;
})();