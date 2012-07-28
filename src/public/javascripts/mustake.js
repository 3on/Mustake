function Mustake () {
	var canvas;
	var ctx;
	var chaussette;
	var self = this;
	var loop = false;
	var images = {};
	var xUnit = 20;
	var yUnit = 20;

	function convX(x) {
		return (canvas.width / 2) + (x * xUnit)
	}

	function convY(y) {
		return (canvas.height / 2) + (-y * yUnit)
	}


	function drawMustache(kind, pos){
		if(kind == "head") var img = images['mustache-head'];
		else if(kind == "head-other") var img = images['mustache-head-other'];
		else var img = images['mustache'];

		//ctx.rotate(Math.PI/2);
		ctx.drawImage(img, 0, 0, img.width, img.height, convX(pos.x), convY(pos.y), img.width / 2, img.height / 2);
		//ctx.restore();
	}

	function drawSnake(mustaches) {
		console.log("> Draw a snake")
		if (mustaches.length < 1) { throw "This snake is way to small" };

		drawMustache('head', mustaches[0]);

		for (var i = 1; i < mustaches.length; i++) {
			drawMustache('tail', mustaches[i]);
		};
	}


	this.draw = function(data) {
		console.log("> update display");
		drawSnake(data.me);
	}

	function preaload() {
		
		var cb = arguments[0];
		var nbPics = arguments.length - 1;
		delete arguments[0];
		//console.log('cb:', cb);

		for(i in arguments) {
			var filename = arguments[i];
			var name = filename.slice(0, filename.lastIndexOf('.'));
			
			//console.log(filename, name)

			images[name] = new Image();
			images[name].src = "/images/" + filename;
			images[name].onload = function() {
				--nbPics;
				//console.log('name: loaded', this.src, "still " + nbPics+ "left")
				if (nbPics === 0) {
					console.log("> All pictures have been loaded");
					cb()
				}
			};

		}
	}
	
	function letsGo(cb){
		return function() {
			//chausette = new Chaussette();
			console.log("> Game started");

			if(cb) cb()
		}
	}

	function init (cb) {
		canvas = document.getElementById("mustake");
		ctx = canvas.getContext('2d');
		loop = true;
		
		preaload(letsGo(cb), 'cloud-75.png', 'cloud-95.png', 'mustache-head.png', 'mustache-head-other.png', 'mustache.png');
	}

	this.start = function (cb) {
		init(cb);

		return self;
	};
}