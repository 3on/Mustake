function Chaussette () {
	var socket = io.connect('http://mustake:8080');

	// render updated game state
	socket.on('update', function(data){
		console.log(data)
		Game.draw(data);
	});
	
	// emit this on keypress
	this.send = function(data){
		//console.log(data)
		socket.emit('keypress', data);
	}

};
