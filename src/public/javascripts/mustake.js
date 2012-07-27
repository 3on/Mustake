function Mustake () {
	var canvas;
	var ctx;
	var chaussette;
	var self = this;
	var loop = false;
	var images = {};


	function drawMustache(kind, pos){
		if(kind == "head") var img = images['mustache-head'];
		else if(kind == "head-other") var img = images['mustache-head-other'];
		else var img = images['mustache'];
	}

	function drawSnake(mustaches) {

	}


	this.draw = function(data) {
		drawSnake(data.me);
	}

	function preaload() {
		
		var cb = arguments[0];
		var nbPics = arguments.length - 1;
		delete arguments[0];
		console.log('cb:', cb);

		for(i in arguments) {
			var filename = arguments[i];
			var name = filename.slice(0, filename.lastIndexOf('.'));
			
			console.log(filename, name)

			images[name] = new Image();
			images[name].src = "/images/" + filename;
			images[name].onload = function() {
				--nbPics;
				//console.log('name: loaded', this.src, "still " + nbPics+ "left")
				if (nbPics === 0) {
					console.log("All pictures have been loaded");
					cb()
				}
			};

		}
	}

	function letsGo(){
		//chausette = new Chaussette();
		console.log("Game started");
	}

	function init (cb) {
		canvas = document.getElementById("mustake");
		ctx = canvas.getContext('2d');
		loop = true;
		
		preaload(letsGo, 'cloud-75.png', 'cloud-95.png', 'mustache-head.png', 'mustache-head-other.png', 'mustache.png');
	}

	this.start = function () {
		init();

		return self;
	};
}