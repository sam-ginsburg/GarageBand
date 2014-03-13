'use strict';

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

// function onInitFs(fs) {
//   console.log('Opened file system: ' + fs.name);
// }

function onInitFs(fs) {

  fs.root.getFile('log.txt', {create: false, exclusive: true}, function(fileEntry) { // create: true, exclusive: true

    // fileEntry.isFile === true
    // fileEntry.name == 'log.txt'
    // fileEntry.fullPath == '/log.txt'

    // fileEntry.remove(function() {
    //   console.log('File removed.');
    // }, errorHandler);

    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var blob = new Blob(['This text is read from a file in the local filesystem.'], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

    fileEntry.createWriter(function(fileWriter) {

      fileWriter.seek(fileWriter.length); // Start write position at EOF.

      // Create a new Blob and write it to log.txt.
      //var blob = new Blob(['This text is read from a file in the local filesystem.'], {type: 'text/plain'});

      //fileWriter.write(blob);

    }, errorHandler);


    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.createElement('textarea');
         txtArea.value = this.result;
         document.body.appendChild(txtArea);
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);

}

window.webkitStorageInfo.requestQuota(window.PERSISTENT, 50*1024*1024, function(grantedBytes) {
  window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
}, function(e) {
  console.log('Error', e);
});

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
  };

  console.log('Error: ' + msg);
}


var Database = {
	init: function() {
	},

	load: function(){
	},

	save: function(myDoc) {
	},

	remove: function(myDoc) {
	}
};