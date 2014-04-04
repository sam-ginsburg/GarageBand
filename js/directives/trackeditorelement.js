var TrackEditorElement = (function() {
	function TrackEditorElement(element, track){
		this.el = element;
		this.track = track;
		this.el.id = this.track.name;
		this.el.innerHTML = document.querySelector('#track-editor-template').innerHTML;

		this.track = track;
		this.el.querySelector('.trackTitle').innerText = this.track.name;

		for(i = 0; i < 100; i++){
			this.el.querySelector('.timescale').innerHTML+="<div class='timeSegment'></div>";
		}

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