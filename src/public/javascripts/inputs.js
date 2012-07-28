function Inputs () {

	function action(e){
		console.log(e.which)
	}

	
	function init(){
		$(document).keydown(action);
	}

	init();
}