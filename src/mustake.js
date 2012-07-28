var _ = require('underscore');

var randomDirection = function() {
	var directions = ['up', 'down', 'left', 'right'];
	return directions[Math.floor(Math.random()*4)];
};

var collision = function(here, objs) {
	_.each(objs, function(obj, index) {
		if (here.x == obj.x && here.y == obj.y) {
			return {object: obj, index: index};
		}
	});
	return null;
};

var Player = function(id, callback) {
	this.data = [{x: 0, y: 0, o: randomDirection()}];
	this.o = this.data[0].o;
	this.id = id;
	this.grow = false;
	this.callback = callback;
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
	},
	setO : function(o) {
		this.o = o;
	},
	grow : function() {
		this.grow = true;
	}
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
		data.error = null;
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
				// check if they hit themself
				//var hitSelf = collision(player.getHead(), player.getInfo().slice(1,))
				// check if clouds have been eaten
				var cloud = collision(player.getHead(), _this.clouds);
				if(cloud) {
					// mark this player to grow next tick
					player.grow();
					// remove the eaten cloud
					_this.clouds = _this.clouds.slice(0, cloud.index).concat(_this.clouds.slice(index+1, _this.clouds.length));
					// add another cloud
				}
			});
			// now call each player's callback and sent it world state
			_.each(_this.players, function(player) {
				player.callback(_this.getInfo(player.getId()));
			});
		}, 2000);
	},
};

module.exports = Mustake;