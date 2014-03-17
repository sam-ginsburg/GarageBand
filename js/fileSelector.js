// <input type="File" id="files" name="files[]" multiple />
// <output id="songs"></output>


function handleFileSelect (evt) {
  console.log("I was selected");
var files = evt.target.files; // FileList object
var output=[];
var counter = 0;
  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0; i < files.length; i++) {
    var f = files[i];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(theBuffer) {
      output.push({name: f.name, buffer: theBuffer.target.result});
      counter++;
      if(counter == files.length){
        var a = new CustomEvent('filesLoaded', {detail: output});
        console.log("filesLoaded event fired");
        window.dispatchEvent(a);
      }
    };


    reader.readAsArrayBuffer(f);
  }
}


window.addEventListener('filesLoaded', function(e) {
  console.log("new listener");
  console.log(e.detail);}
);
document.getElementById('files').addEventListener('change', handleFileSelect, false);

