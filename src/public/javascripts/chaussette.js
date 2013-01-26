function Chaussette () {
	var url = 'http://mustake:8080';
	url = 'http://mustake-3on.dotcloud.com';
	var socket = io.connect(url);

	// render updated game state
	socket.on('update', function(data){
		//console.log(data)
		Game.draw(data);
	});
	
	// emit this on keypress
	this.send = function(data){
		//console.log(data)
		socket.emit('keypress', data);
	}

};
