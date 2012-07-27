function Chaussette () {
	// render updated game state
	io.on('update', function(data) {
	
	}
	
	// emit this on keypress
	io.emit('keypress', data);

});
