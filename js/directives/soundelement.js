var SoundElement = (function() {
	function SoundElement(element, sound) {
		this.el = element;
		this.sound = sound;
		this.el.id = this.sound.name;
		this.el.innerHTML = document.querySelector('#sound-template').innerHTML;

		this.el.querySelector('.name').innerText = this.sound.name;

		this.el.querySelector('.play')
		.addEventListener('click', this.play.bind(this));

		this.el.querySelector('.stop')
		.addEventListener('click', this.stop.bind(this));

		this.el.querySelector('.del')
		.addEventListener('click', this.del.bind(this));

		this.el.querySelector('.pause')
		.addEventListener('click', this.pause.bind(this));
	}

	SoundElement.prototype.play = function() { // do stuff on play }
		window.dispatchEvent(new CustomEvent('audio.play', {detail: this.sound}));
	};

	SoundElement.prototype.stop = function() { // do stuff on stop }
		window.dispatchEvent(new CustomEvent('audio.stop', {detail: this.sound}));
	};

    SoundElement.prototype.del = function() { // do stuff on stop }
		window.dispatchEvent(new CustomEvent('audio.del', {detail: this.sound}));
	};

	SoundElement.prototype.pause = function() { // do stuff on pause }
		window.dispatchEvent(new CustomEvent('audio.pause', {detail: this.sound}));
	};

	// SoundElement.prototype.add = function() { // do stuff on add }
	// 	var trackPiece = {
	// 		song: this.sound,
	// 		trackloc: document.getElementById("track-placement"),
	// 		start: document.getElementById("sound-start"),
	// 		dur: document.getElementById("duration")
	// 	};
	// 	console.log("yay");
	// 	window.dispatchEvent(new CustomEvent('audio.add', {detail: trackPiece}));
	// };

	return SoundElement;
})();