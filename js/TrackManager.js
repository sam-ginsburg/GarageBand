var TrackManager =(function() {
function TrackEditiorElement (name, songElements){
	this.name = name;
	this.info = songElements;
	//array of JSON objects w/ name, start, stop
	//for songs
}

var TrackManager = {
	context: new window.webkitAudioContext(),
	playing: null,


	tracks: new ObservableArray("Tracks"),
	currentTrack: new Track(),
	track_hash: {},

	//name: --> may need a different name
	//should populate the track editor

	play: function(evt){
		var sampleRate = 44100;
		var songPieces = evt.detail.info;
		var trackLength = songPieces.reduce(function() {
			return acc += value.dur;
		},0);
		var trackBuffer = context.createBuffer(1,sampleRate*trackLength,sampleRate);

		var curLocation = 0;
		var curBuffer;

		for(var i=0; i<songPieces.length; i++){
			if(songPieces[i].song === null){
				var dur = songPieces[i].dur;
				curLocation += dur * sampleRate;
			}
			else{
				var startTime = songPieces[i].start * sampleRate;
				var duration = songPieces[i].dur * sampleRate;
				curBuffer = songPieces[i].song.audio.subarray(startTime, startTime + duration);
				trackBuffer.getChannelData(0).set(curLocation * sampleRate, curBuffer);
				curLocation += duration;
			}
		}

		if(this.playing){
			this.stop();
		}
		var source = context.createBufferSource();

		//should be the same as playing any buffer
	}

	stop: function(evt){
		if(!evt || this.playing && (evt.detail === this.playing.sound)){
			this.playing.source.stop(0);
			index = this.paused.indexOf(this.playing.sound);
			console.log(index);
			if(index > -1){
				this.paused[index].startOffset = 0;
				console.log(this.paused[index].startOffset);
			}

			this.playing = null;
		}
		else if(evt.detail){
			index = this.paused.indexOf(evt.detail);
			console.log(index);
			if(index > -1){
				this.paused[index].startOffset = 0;
				console.log(this.paused[index].startOffset);
			}
		}
	},

	del: function(evt){ //needs to be chaged to accomidate divs
		var table = document.getElementById("track-display");
		var rowCount = table.rows.length;
		var trackName;
		if(evt.detail){
			trackName = evt.detail.name;
		} else{
			songName = evt;
		}
		for(var i=0; i<rowCount; i++){
			var row = table.rows[i];
			console.log(row.id);
			if(row.id == trackName) {
				table.deleteRow(i);
				rowCount--;
				i--;
			}
		}
		FileSystem2.removeTrack(window.currentProject.name, trackName);
	},

	load: function(evt){
		document.getElementById("track-name").innerHTML = currentTrack.name;
	}

};
//window.addEventListener('track.editor', TrackManager.name.bind(TrackManager));
window.addEventListener('track.play', TrackManager.play.bind(TrackManager));
//window.addEventListener('track.stop', TrackManager.stop.bind(TrackManager));
window.addEventListener('track.del', TrackManager.del.bind(TrackManager));
window.addEventListener('track.load', TrackManager.load.bind(TrackManager));
return TrackManager;
})();