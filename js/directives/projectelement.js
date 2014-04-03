var ProjectElement = (function() {
	function ProjectElement(element, project) {
		this.el = element;
		this.el.id = project;
		this.el.innerHTML = 
		document.querySelector('#project-template').innerHTML;

		this.name = project;
		this.el.querySelector('.name').innerText = this.name;

		this.el.querySelector('.load')
		.addEventListener('click', this.load.bind(this));

		this.el.querySelector('.del')
		.addEventListener('click', this.del.bind(this));
	}

	ProjectElement.prototype.load = function() { // do stuff on stop }
		window.dispatchEvent(new CustomEvent('project.load', {detail: this.name}));
	}

    ProjectElement.prototype.del = function() { // do stuff on stop }
		window.dispatchEvent(new CustomEvent('project.del', {detail: this.name}));
	}

	return ProjectElement;
})();