
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

var context;
var bufferLoader;

function init() {
  context = new webkitAudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      './test3.mp3',
      './test2.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

var sources = [];
var myBufferList;

function finishedLoading(bufferList) {
  myBufferList = bufferList;
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  
  sources.push(source1);
  sources.push(source2);
}

var currentSongIndex = -1;

function stopSound(){
  // We have to remove and recreate the buffer source to play again
  if(currentSongIndex != -1){
    sources[currentSongIndex].stop();
    sources[currentSongIndex] = context.createBufferSource();
    sources[currentSongIndex].buffer = myBufferList[currentSongIndex];
    sources[currentSongIndex].connect(context.destination);
  }

  currentSongIndex = -1;
  return -1;
}

function playSound(index){
  stopSound();
  currentSongIndex = index;
  sources[index].start(0);
  return index;
}

init();