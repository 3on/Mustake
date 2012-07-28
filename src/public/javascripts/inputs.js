function Inputs () {
	var keyValue = {37: "left", 38: "up", 39: "right", 40: "down"}

	function action(e){
		console.log(e.which, keyValue[e.which]);
		Game.chaussette.send({key: keyValue[e.which]})
	}

	
	function init(){
		$(document).keydown(action);
	}

	init();
}