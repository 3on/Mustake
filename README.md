Mustake
=======

Mustache Snake in JavaScript and Node.js.  
The entire game logic is made server side in Node.js and the client side only emit inputs events to the server and listen to an update to redraw a frame.  
The client by itself holds no data and do not update the frame unless it get a heartbeat from the server.  

The game is multiplayer and the map is dynamic and grow as the players moves around. 
