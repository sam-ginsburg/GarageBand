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
		var songPieces = evt.detail.info;
		var trackBuffer = context.createBuffer(2,0,44100);
		for(var i=0; i<songPieces.length; i++){
			if(songPieces[i].song === null){
				var dur = songPieces[i].dur;
				trackBuffer.getChannelData(0).set(context.createBuffer(2,(dur*44100),44100));
			}
			else{
				var subBuffer = songPieces[i].song.audio.slice() 
				//need to splice by start/stop time but do not know how to convert to bytes
			}
		}

		if(this.playing){
			this.stop();
		}
		var source = context.createBufferSource();

		//should be the same as playing any buffer
	}

	stop: function(evt){

	},

	del: function(evt){
		var table = document.getElementById("trackList");
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
//window.addEventListener('track.play', TrackManager.play.bind(TrackManager));
//window.addEventListener('track.stop', TrackManager.stop.bind(TrackManager));
window.addEventListener('track.del', TrackManager.del.bind(TrackManager));
window.addEventListener('track.load', TrackManager.load.bind(TrackManager));
return TrackManager;
})();