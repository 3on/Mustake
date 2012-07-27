function Mustake () {
	var canvas;
	var ctx;
	var chaussette;
	var self = this;
	var loop = false;
	var images = {};


	this.draw = function(data) {
		
	}

	function preaload() {
		
		var cb = arguments[0];
		delete arguments[0];
		console.log('cb:', cb);

		for(i in arguments) {
			var filename = arguments[i];
			var name = filename.slice(0, filename.lastIndexOf('.'));
			
			console.log(filename, name)

			images[name] = new Image();
			images[name].src = "/images/" + filename;
			images[name].onload = function() { console.log('name: loaded', this.src) };

		}
	}


	function init (cb) {
		canvas = document.getElementById("mustake");
		ctx = canvas.getContext('2d');
		loop = true;
		//chausette = new Chaussette();
		preaload(function(){}, 'cloud-75.png', 'cloud-95.png', 'mustache-head.png', 'mustache.png');
	}

	this.start = function () {
		init();

		return self;
	};
}