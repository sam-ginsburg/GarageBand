var TrackElement = (function() {
	function TrackElement(element, track){
		this.el = element;
		this.track = track;
		this.el.id = this.track.name;
		this.el.innerHTML = document.querySelector('#track-template').innerHTML;

		this.track = track;
		this.el.querySelector('.name').innerText = this.track.name;
		this.el.querySelector('.name')
		.addEventListener('click', this.name.bind(this));

		this.el.querySelector('.play')
		.addEventListener('click', this.play.bind(this));

		this.el.querySelector('.stop')
		.addEventListener('click', this.stop.bind(this));

		this.el.querySelector('.del')
		.addEventListener('click', this.del.bind(this));

		this.el.querySelector('.load')
		.addEventListener('click', this.load.bind(this));
	}

	TrackElement.prototype.name = function() {//populate the track editor
		window.dispatchEvent(new CustomEvent('track.editor', {detail: this.track}));
	};

	TrackElement.prototype.play = function() {
		window.dispatchEvent(new CustomEvent('track.play', {detail: this.track}));
	};

	TrackElement.prototype.stop = function() {
		window.dispatchEvent(new CustomEvent('track.stop', {detail: this.track}));
	};

	TrackElement.prototype.del = function() {
		window.dispatchEvent(new CustomEvent('track.del', {detail: this.track}));
	};

	TrackElement.prototype.load = function() {
		window.dispatchEvent(new CustomEvent('track.load', {detail: this.track}));
	};
	return TrackElement;
})();