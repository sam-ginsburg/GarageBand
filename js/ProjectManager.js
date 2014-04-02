var ProjectManager = (function(){
	function Project (name, songs, tracks) {
		this.name = name;
		this.songs = songs;
		this.tracks = tracks;
	}

	var ProjectManager = {

        projects: new ObservableArray("Projects"),
        currentProject: new Project(),
        project_hash: {},

		switchProject: function(name){
			if (name in this.project_hash) {
				getProject(name, console.log());
			} else {
				console.error("Error in switching project, invalid name");
			}
		},

		init: function(evt){
			var self = this;
			this.projects.extend(evt.detail.map(function(name){
				var project = new Project(name);
				self.project_hash[name] = project;
				return project;
			}));
		}
	};

	window.addEventListener('projectsPulled', ProjectManager.init.bind(ProjectManager), false);
	return ProjectManager;
})();