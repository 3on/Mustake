var express = require('express')
    , _ = require('underscore')
    , http = require('http')
    , app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server, { log: false })
    , mustake = require('./mustake.js');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

var game = new mustake();

io.on('connection', function(socket) {
    var player = game.createPlayer(function(data) {
        socket.emit('update', data);
    });
    socket.on('keypress', function(data) {
        var key = data.key;
        if (['up', 'down', 'left', 'right'].indexOf(key) >= 0) {
            player.setO(key);
        }
    });
    socket.on('disconnect', function(data) {
        game.removePlayer(player.getId());
        delete player;
    })
});

console.log('Starting server on port: ' , process.env.PORT_WWW || 8080)
server.listen(process.env.PORT_WWW || 8080);
game.run();