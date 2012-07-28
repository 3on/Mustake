var _ = require('underscore');

var randomDirection = function() {
	var directions = ['up', 'down', 'left', 'right'];
	return directions[Math.floor(Math.random()*4)];
};

var collision = function(here, objs) {
	var match = null;
	_.each(objs, function(obj, index) {
		if (here.x === obj.x && here.y === obj.y) {
			console.log(obj);
			match = {object: obj, index: index};
		}
	});
	return match;
};

var Player = function(id, callback) {
	this.data = [{x: 0, y: 0, o: randomDirection()}];
	this.o = this.data[0].o;
	this.id = id;
	this.grow = false;
	this.callback = callback;
	this.alive = true;
};

Player.prototype = {
	callback : function(data) {
		this.callback(data);
	},
	getInfo : function(transform) {
		var info = [];
		var x = 0;
		var y = 0;
		if(transform) {
			x = transform.x | 0;
			y = transform.y | 0;
		}
		_.each(this.data, function(point) {
			info.push({x: point.x - x, y: point.y - y, o: point.o});
		});
		return info;
	},
	getHead : function() {
		return this.data[0];
	},
	getId : function() {
		return this.id;
	},
	advance : function() {
		if(this.alive) {
			var head = this.data[0];
			var newHead = {x: head.x, y: head.y, o: this.o};
			if (head.o == 'up') {
				newHead.y = head.y + 1;
			}
			else if( head.o == 'down') {
				newHead.y = head.y - 1;
			}
			else if( head.o == 'left') {
				newHead.x = head.x - 1;
			}
			else if( head.o == 'right') {
				newHead.x = head.x + 1;
			}
			else {
				throw 'unacceptable head orientation: ' + head.o;
			}
			this.data.unshift(newHead);
			if(!this.grow) {
				this.data.pop();
				this.grow = false;
			}
		}
	},
	setO : function(o) {
		this.o = o;
	},
	markGrow : function() {
		this.grow = true;
	},
	kill : function() {
		this.alive = false;
	},
	isAlive : function() {
		return this.alive;
	},
	length : function() {
		return this.data.length;
	},
};

var Mustake = function() {
	this.players = {};
	this.clouds = [];
	this.nextId = 0;
};

Mustake.prototype = {
	createPlayer : function(callback) {
		var id = this.nextId++;
		this.players[id] = new Player(id, callback);
		this.addCloud({x: 0, y: 0, radius: 20});
		this.addCloud({x: 0, y: 0, radius: 20});
		this.addCloud({x: 0, y: 0, radius: 20});
		this.addCloud({x: 0, y: 0, radius: 20});
		return this.players[id];
	},
	removePlayer : function(id) {
		delete this.players[id];
	},
	addCloud : function(params) {
		var newCloud = {};
		newCloud.x = Math.floor(Math.random()*params.radius - Math.floor(params.radius / 2) + params.x);
		newCloud.y = Math.floor(Math.random()*params.radius - Math.floor(params.radius / 2) + params.y);
		if(collision(newCloud, this.clouds)) {
			this.addCloud(params);
		}
		else {
			this.clouds.push(newCloud);
		}
	},
	getInfo : function(id) {
		var data = {};
		var head = this.players[id].getHead();
		data.me = this.players[id].getInfo(head);
		data.players = [];
		if(this.players[id].isAlive()) {
			data.error = null;
		}
		else {
			data.error = 'you are dead';
		}
		_.each(this.players, function(player) {
			if(id !== player.getId()) {
				data.players.push(player.getInfo(head));
			}
		});
		data.clouds = [];
		_.each(this.clouds, function(cloud) {
			data.clouds.push({x: cloud.x - head.x, y: cloud.y - head.y});
		})
		return data;
	},
	run : function() {
		var _this = this;
		setInterval(function() {
			// advance and detect collisions
			_.each(_this.players, function(player) {
				player.advance();
				var head = player.getHead();
				// check if they hit themself
				var hitSelf = collision(player.getHead(), player.getInfo().slice(1,player.length()));
				if(hitSelf) {
					player.kill();
				}
				// check if clouds have been eaten
				var cloud = collision(player.getHead(), _this.clouds);
				if(cloud) {
					// mark this player to grow next tick
					player.markGrow();
					// remove the eaten cloud
					_this.clouds = _this.clouds.slice(0, cloud.index).concat(_this.clouds.slice(cloud.index+1, _this.clouds.length));
					// add another cloud
					addCloud({x: head.x, y: head.y, radius: 20});
				}
			});
			// now call each player's callback and sent it world state
			_.each(_this.players, function(player) {
				player.callback(_this.getInfo(player.getId()));
			});
		}, 500);
	},
};

module.exports = Mustake;