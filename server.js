/**
 * Important note: this application is not suitable for benchmarks!
 */

var http = require('http')
		, url = require('url')
		, fs = require('fs')
		, io = require('socket.io')
		, sys = require('sys')
	    , util = require('util')
		, server;

server = http.createServer(function(req, res) {

	// dispatcher - maybe, someday.
	var path = url.parse(req.url).pathname;
	if (path == '/') {
		fs.readFile(__dirname + "/index.html", function(err, data) {
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.write(data, 'utf8');
			res.end();
		});
	} else if (path.match(/\.js$/)) {
		fs.readFile(__dirname + path, function(err, data) {
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type':'text/javascript'})
			res.write(data, 'utf8');
			res.end();
		});
	} else if (path.match(/\.css$/)) {
		fs.readFile(__dirname + path, function(err, data) {
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/css'})
			res.write(data, 'utf8');
			res.end();
		})
	} else if (path.match(/\.png$/)) {
		fs.readFile(__dirname + path, function(err, data) {
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'image/png'})
			res.write(data, 'utf8');
			res.end();
		})
	} else if (path.match(/\.ttf/)) {
		fs.readFile(__dirname + path, function(err, data) {
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'application/octet-stream'})
			res.write(data, 'utf8');
			res.end();
		})
	}

	else {
		send404(res);
	}

}),

	send404 = function(res) {
		res.writeHead(404);
		res.write('404');
		res.end();
	};

server.listen(80);
console.log("scorch");

// socket.io
var io = io.listen(server);


game = (function() {

	var pew = {};
	var players = {};

	return {

		joinPlayer: function(client) {
			player[client.sessionId] = client;
			client.broadcast({ type: 'playerJoined', data: client.sessionId });


		}

	}

})()


Player = function(name, client) {
	this.name = name;
	this.client = client;
}

io.on('connection', function(client) {
	// client.broadcast({ type: 'announcement', data: client.sessionId + ' connected' });

	client.send({type: 'connected'});

	client.on('message', function(rec) {

	});

	client.on('disconnect', function(rec) {
		// client.broadcast({ type: 'announcement', data: client.sessionId + ' disconnected' });

	});
});
