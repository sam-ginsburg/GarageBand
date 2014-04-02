var ObservableArray = (function() {
	'use strict';

	function ObservableArray(namespace) {
		this.list = [];
		this.namespace = namespace;
	}

	ObservableArray.prototype.push = function(observable) {
		this.list.push(observable);
		window.dispatchEvent(new CustomEvent(this.namespace + '.added', {detail: [observable]} ));
	};

	ObservableArray.prototype.extend = function(list) {
		var self = this;
		list.forEach(function(observable) {
			self.list.push(observable);
		});
		window.dispatchEvent(new CustomEvent(this.namespace + '.added', {detail: list}));
	};

	ObservableArray.prototype.listen = function(name, listener) {
		window.addEventListener(this.namespace + "." + name, listener.bind(this));
	};

	return ObservableArray;

})();