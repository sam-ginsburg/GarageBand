var TrackManager =(function() {
	function Track (name, songElements){
		this.name = name;
		this.info = songElements;
		//array of JSON objects w/ name, start, stop
		//for songs
	}

	var TrackManager = {
		playing: null,

		tracks: new ObservableArray("Tracks"),
		currentTrack: new Track(),
		track_hash: {},

		//name: --> may need a different name
		//should populate the track editor

		//play:
		//stop:

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
			console.log(window.currentProject);
			FileSystem2.removeTrack(window.currentProject.name, trackName);
		}

	};
	//window.addEventListener('track.editor', TrackManager.name.bind(TrackManager));
	//window.addEventListener('track.play', TrackManager.play.bind(TrackManager));
	//window.addEventListener('track.stop', TrackManager.stop.bind(TrackManager));
	window.addEventListener('track.del', TrackManager.del.bind(TrackManager));
	return TrackManager;
})();