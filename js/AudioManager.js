var AudioManager = (function() {

	var AudioManager = {
		context: new window.webkitAudioContext(),
		playing: null,

		play: function(evt){
			var soundToPlay = evt.detail;
			if(this.playing){
				this.stop();
			}
			var source = context.createBufferSource();
			source.buffer = soundToPlay.audio;
			source.connect(context.destination);
			source.start(0);
			this.playing = {
				sound: soundToPlay,
				source: source
			};
		},


		stop: function(evt){
			if(!evt || (this.playing && evt.detail === this.playing.sound)){
				this.playing.source.stop(0);
				this.playing = null;
			}
		},

		del: function(evt){
			var table = document.getElementById('songList');
			var rowCount = table.rows.length;
			var songName;
			if(evt.detail){
				songName = evt.detail.name;
			} else{
				songName = evt;
			}
			for(var i=0; i<rowCount; i++) {
			var row = table.rows[i];
			console.log(row.id);
			if(row.id==songName) {
					table.deleteRow(i);
					rowCount--;
					i--;
				}
			}
			console.log(window.currentProject);
			FileSystem2.removeSound(window.currentProject.name, songName);
		}

	};
	window.addEventListener('audio.play', AudioManager.play.bind(AudioManager));
	window.addEventListener('audio.stop', AudioManager.stop.bind(AudioManager));
	window.addEventListener('audio.del', AudioManager.del.bind(AudioManager));
	return AudioManager;
})();