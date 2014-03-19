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
		window.addEventListener('filesPulled', this.printfiles)
		this.load();
	},

	load: function(){
		window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetFiles, errorHandler);
	},

	save: function(event) {
		var filesList = event.detail;
		console.log(filesList);
		fileListToSave = filesList;
		console.log("length: " + filesList.length);
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
    console.log("saving file " + i);

    (function(f) {
      fs.root.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
        console.log(f.fileEntry);
        // console.log(f.buffer.type);
        fileEntry.createWriter(function(fileWriter) {
            // var buffs = [];
            // buffs.push(f.buffer);
            // var blob = new Blob(buffs);
            fileWriter.write(f); // Note: write() can take a File or Blob object.
          }, errorHandler);
      }, errorHandler);
    })(file);
  }
  console.log(fileListToSave);
  var a = new CustomEvent('filesSaved', {detail: fileListToSave});
  window.dispatchEvent(a);

  // var c = new CustomEvent('requestFiles', {detail: fileListToSave});
  // window.dispatchEvent(c);

}

function toGetFiles(fs){

  var dirReader = fs.root.createReader();

  var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
     dirReader.readEntries (function(results) {
      // if (!results.length) {
      //   //listResults(entries.sort());
      // } else {
        entries = entries.concat(toArray(results));
        console.log(results);
        console.log(entries);
        filesOut = convertToObjs(entries);
        // filesOut = entries;
        //readEntries();
        // var b = new CustomEvent('filesPulled', {detail: filesOut});
        // window.dispatchEvent(b); // this is temporary until I can get a damn promise to work
      //}
    }, errorHandler);

//     return new Promise(function(resolve, reject) {
//       if(entries.length !== 0){
//         resolve("IT WORKED");
//       }
//       else {
//         reject(Error("It broke."));
// //        console.log(entries);
//       }
//     });

  };

  readEntries();
//   readEntries().then(function(result) {
//   console.log(result); // "Stuff worked!"
// }, function(err) {
//   console.log(err); // Error: "It broke"
// }); // Start reading dirs.
  // console.log(entries);
  // //filesOut = entries;
  // console.log(filesOut);

  // var b = new CustomEvent('filesPulled', {detail: filesOut});
  // window.dispatchEvent(b);

}

function convertToObjs(fileentries){
	var res = [];

	for(var i = 0; i<fileentries.length; i++){
		var curfile = fileentries[i];

		curfile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				console.log(file.name);
				res.push({name: file.name, buffer: this.result});
				console.log(res);
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