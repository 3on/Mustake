function Chaussette () {
	var socket = io.connect('http://localhost:8080');

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
