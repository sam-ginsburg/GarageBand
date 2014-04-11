var AudioManager = (function() {

	var AudioManager = {
		context: new window.webkitAudioContext(),
		playing: null,
		paused: [],
		startTime: null,

		play: function(evt){
			var soundToPlay = evt.detail;
			var index = this.paused.indexOf(soundToPlay);
			if(this.playing){
				this.stop();
			}
			var source = context.createBufferSource();

			if(index > -1){
				source.buffer = this.paused[index].buffer;
				source.startOffset = this.paused[index].startOffset;
				console.log("offset " + source.startOffset);
			}
			else{
				source.buffer = soundToPlay.buffer;
				soundToPlay.startOffset = 0;
				console.log(0);
			}
			source.connect(context.destination);
			source.start(0, source.startOffset % source.buffer.duration);
			startTime = context.currentTime;
			this.playing = {
				sound: soundToPlay,
				source: source
			};
		},

		pause: function(evt){
			if(!evt || (this.playing && evt.detail === this.playing.sound)){
				console.log(this.playing.sound.startOffset);
				if(this.paused.indexOf(this.playing.sound) == -1)
					this.paused.push(this.playing.sound);

				this.playing.source.stop();
				console.log(context.currentTime - startTime);
				this.playing.sound.startOffset += (context.currentTime - startTime);

				this.playing = null;
			}
		},

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
	window.addEventListener('audio.pause', AudioManager.pause.bind(AudioManager));
	return AudioManager;
})();