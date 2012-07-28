function Mustake () {
	var canvas;
	var ctx;
	this.chaussette = null;
	var inputs;
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

		var dx = convX(pos.x) - (img.width / 2);
		var dy = convY(pos.y) - (img.height / 2);

		var dWidth = img.width / 2;
		var dHeight = img.height / 2;

		ctx.save();
		if(pos.o == "down") {
			ctx.translate(dx, dy);
			ctx.rotate(Math.PI/2);
		}
		else if(pos.o == "up") {
			ctx.translate(dx, dy);
			ctx.rotate(-Math.PI/2);
		}
		else if(pos.o == "left") {
			ctx.translate(dx, dy);
			ctx.rotate(Math.PI);
		}
		else if(pos.o == "right") {
			ctx.translate(dx, dy);
			ctx.rotate(0);
		}
		//ctx.fillStyle = "rgb(255,0,0)";  
 		//ctx.fillRect (-2, -2, 4, 4);

		ctx.drawImage(img, 0, 0, img.width, img.height, -(img.width / 2), -(img.width / 2), dWidth, dHeight);
		ctx.restore();
	}

	function drawSnake(mustaches, me) {
		//console.log("> Draw a snake")
		if (mustaches.length < 1) { throw "This snake is way to small" };

		me = (me === undefined)? true: false;
		var kind = (me)?'head':'head-other';
		drawMustache(kind, mustaches[0]);

		for (var i = 1; i < mustaches.length; i++) {
			drawMustache('tail', mustaches[i]);
		};
	}

	function drawPlayers(players){
		for (var i = 0; i < players.length; i++) {
			drawSnake(players[i], false);
		};
		
	}


	this.draw = function(data) {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		//console.log("> update display");
		drawSnake(data.me);
		drawPlayers(data.players);
		drawClouds(data.clouds);
	}

	function drawCloud(pos){
		var img = images['dotcloud'];

		var dWidth = img.width / 2;
		var dHeight = img.height / 2;

		var dx = convX(pos.x) - (img.width / 2) ;
		var dy = convY(pos.y) - (img.height) ;

		

		//ctx.fillStyle = "rgb(0,255,0)";  
 		//ctx.fillRect (dx - 2, dy -2, 4, 4);

		ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dWidth, dHeight);
	}


	function drawClouds(clouds) {
		for (var i = 0; i < clouds.length; i++) {
			drawCloud(clouds[i]);
		};
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
			self.chaussette = new Chaussette();
			inputs = new Inputs();
			console.log("> Game started");

			if(cb) cb()
		}
	}

	function init (cb) {
		canvas = document.getElementById("mustake");
		ctx = canvas.getContext('2d');
		loop = true;
		
		preaload(letsGo(cb), 'cloud-75.png', 'cloud-95.png', 'mustache-head.png', 'mustache-head-other.png', 'mustache.png', 'dotcloud.png');
	}

	this.start = function (cb) {
		init(cb);

		return self;
	};
}