function Chaussette () {
	if(!io) {
		console.log("socket IO is not working!!!")
		return
	}
	
	// render updated game state
	io.on('update', function(data){
	
	});
	
	// emit this on keypress
	io.emit('keypress', data);

};
