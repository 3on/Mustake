var express = require('express')
	, _ = require('underscore')
	, app = express.createServer()
	, server_config = new mongo.Server('localhost', 27017, {auto_reconnect: true})
	, io = require('socket.io').listen(app);

