
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);


var users = {}
var new_user = null

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('join', {
    title: 'Express'
  });
});

app.post('/join', function(req, res){
	console.log('NAME: ' + req.body.username);
	new_user = req.body.username;

	res.redirect('/chat');
});

app.get('/chat', function(req, res){
	var socket = io.connect('http://localhost');
	socket.emit('new user', new_user)

	res.render('index', {
		title: 'Chatting you up...'
	});
});

app.listen(3000, function(){
	var addr = app.address();
	console.log('Express server running on http://' + addr.address + ':' + addr.port);
});

// Socket.io server

io.sockets.on('connection', function (socket) {
	socket.on('message', function (msg) {
		socket.broadcast.emit('message', msg);
		console.log('message sent: ' + msg);
	});

	socket.on('new user', function (username) {
		socket.broadcast.emit('new user', username);
		console.log('broadcasting new user: ' + username);
	})
});
