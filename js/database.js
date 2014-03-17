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

(function() {
  function FileSaver() {
    this.listener = this.save.bind(this);
    window.addEventListener('filesLoaded', this.listener);
  }

 FileSaver.prototype.save = function(event) {
    var filesList = event.detail;
    fileListToSave = filesList;
    console.log("length: " + filesList.length);
    window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toSaveFiles, errorHandler);

  };

  var filesaverobj = new FileSaver();

})();

function toSaveFiles(fs){
  for (var i = 0, file; file = fileListToSave[i]; ++i) {
    console.log("saving file " + i);

    (function(f) {
      fs.root.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
        console.log(f.name);
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.write(f); // Note: write() can take a File or Blob object.
          }, errorHandler);
      }, errorHandler);
    })(file);
  }

  //console.log(fileListToSave);
  var a = new CustomEvent('filesSaved', {detail: fileListToSave});
  window.dispatchEvent(a);

  var c = new CustomEvent('requestFiles', {detail: fileListToSave});
  window.dispatchEvent(c);

}

(function() {
  function FileGetter() {
    this.listener = this.getAll.bind(this);
    window.addEventListener('requestFiles', this.listener);
  }

 FileGetter.prototype.getAll = function(event) {
    window.requestFileSystem(window.PERSISTENT, myGrantedBytes, toGetFiles, errorHandler);
  };

  var filegetterobj = new FileGetter();

})();

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
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
        filesOut = entries;
        //readEntries();
        var b = new CustomEvent('filesPulled', {detail: filesOut});
        window.dispatchEvent(b); // this is temporary until I can get a damn promise to work
      //}
    }, errorHandler);

    return new Promise(function(resolve, reject) {
      if(entries.length !== 0){
        resolve("IT WORKED");
      }
      else {
        reject(Error("It broke."));
//        console.log(entries);
      }
    });

  };

  readEntries().then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
}); // Start reading dirs.
  // console.log(entries);
  // //filesOut = entries;
  // console.log(filesOut);

  // var b = new CustomEvent('filesPulled', {detail: filesOut});
  // window.dispatchEvent(b);

}

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