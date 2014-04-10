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

	SoundElement.prototype.pause = function() { // do stuff on play }
		window.dispatchEvent(new CustomEvent('audio.pause', {detail: this.sound}));
	};

	return SoundElement;
})();