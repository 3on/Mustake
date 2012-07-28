var express = require('express')
    , _ = require('underscore')
    , app = express.createServer()
    , io = require('socket.io').listen(app)
    , mustake = require('./mustake.js');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    //app.use(express.csrf());
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
        console.log(data);
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

app.listen(8080);
game.run();