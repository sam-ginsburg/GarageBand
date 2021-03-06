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

		load: function(evt){
			getProject(evt.detail);
			var projectName = document.getElementById("currentProject");
			projectName.innerHTML = "";
			projectName.innerHTML = "Current Project: " + evt.detail;
			var table = document.getElementById('projectList');
			var rowCount = table.rows.length;
			var found = true;

			for(var i=0; i<rowCount; i++) {
				var row = table.rows[i];
				table.deleteRow(i);
				rowCount--;
				i--;
			}

			table = document.getElementById('trackList');
			rowCount = table.rows.length;
			found = true;

			for(var i=0; i<rowCount; i++) {
				row = table.rows[i];
				table.deleteRow(i);
				rowCount--;
				i--;
			}

			table = document.getElementById('songList');
			rowCount = table.rows.length;
			found = true;

			for(var i=0; i<rowCount; i++) {
				row = table.rows[i];
				table.deleteRow(i);
				rowCount--;
				i--;
			}
		},

		del: function(evt){
			var table = document.getElementById('projectList');
			var rowCount = table.rows.length;
			var projectName = evt.detail;
			for(var i=0; i<rowCount; i++) {
				var row = table.rows[i];
				console.log(row.innerHTML);
				if(row.id==projectName) {
					table.deleteRow(i);
					rowCount--;
					i--;
				}
			}
			FileSystem2.removeProject(projectName);
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

	window.addEventListener('project.load', ProjectManager.load.bind(ProjectManager));
	window.addEventListener('project.del', ProjectManager.del.bind(ProjectManager));
	window.addEventListener('projectsPulled', ProjectManager.init.bind(ProjectManager), false);
	return ProjectManager;
})();