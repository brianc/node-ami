var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Action = require(__dirname + '/action');
var Parser = require(__dirname + '/parser');
var Client = function(socket) {
  EventEmitter.call(this);
  this.socket = socket || new require('net').Socket();
  this._pendingActions = [];

  var parser = new Parser();
  this.socket.setEncoding('utf8');
  this.socket.on('error', this.emit.bind(this, 'error'))
  this.socket.on('data', parser.parse.bind(parser));
  parser.on('parse', this.receive.bind(this));
}

util.inherits(Client, EventEmitter);

//connect client to asterisk AMI server
Client.prototype.connect = function(port, host, connectListener) {
  this.socket.connect(port, host, connectListener);
}

//receive a message from the parser
Client.prototype.receive = function(message) {
  
}

//send an action to the server
Client.prototype.send = function(action) {
  if(!(action instanceof Action)) {
    action = new Action(action);
  }
  this._pendingActions.push(action);
  this.socket.write(action.serialize());
}

Client.prototype.login = function(username, secret, onLogin) {
  var self = this;
  this.send({
    action: 'login',
    username: username,
    secret: secret
  }, onLogin);
}

module.exports = Client;
