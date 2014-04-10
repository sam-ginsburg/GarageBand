var TrackEditorElement = (function() {
	function TrackEditorElement(element, track){
		this.el = element;
		this.track = track;
		this.el.id = this.track.name;
		this.el.innerHTML = document.querySelector('#track-editor-template').innerHTML;

		this.track = track;
		// this.el.querySelector('.trackTitle').innerText = this.track.name;

		this.timescale = this.el.querySelector('.timescale');
		
		for(i = 0; i < 100; i++){
			var el = document.createElement('div');
			el.className = 'timeSegment';
			this.timescale.appendChild(el);
		}

		this.timeNumbering = this.el.querySelector('.timenumbering');
		var i = 0;
		var counter = 0;
		var adder = "";

		for(i = 0; i < 100; i++){
		if(i%20==0||i==(100-1)){
			adder=counter;
			counter++;
		}
		this.timeNumbering.innerHTML+="<div class='timeNumber'>"+adder+"</div>";
		adder="";
	}
	}

	TrackEditorElement.prototype.name = function() {//populate the track editor
		window.dispatchEvent(new CustomEvent('track.editor', {detail: this.track}));
	};

	TrackEditorElement.prototype.play = function() {
		window.dispatchEvent(new CustomEvent('track.play', {detail: this.track}));
	};

	TrackEditorElement.prototype.stop = function() {
		window.dispatchEvent(new CustomEvent('track.stop', {detail: this.track}));
	};

	TrackEditorElement.prototype.del = function() {
		window.dispatchEvent(new CustomEvent('track.del', {detail: this.track}));
	};

	TrackEditorElement.prototype.load = function() {
		window.dispatchEvent(new CustomEvent('track.load', {detail: this.track}));
	};

	return TrackEditorElement;
})();