function Chaussette () {
	var socket = io.connect('http://localhost');
	if(!io) {
		console.log("socket IO is not working!!!")
		return
	}
	
	// render updated game state
	io.on('update', function(data){
		Game.draw(data);
	});
	
	// emit this on keypress
	io.emit('keypress', data);

};
