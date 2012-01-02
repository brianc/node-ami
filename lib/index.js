var ami = {
}

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Client = function(socket) {
  EventEmitter.call(this);
  this.socket = socket || new require('net').Socket();
  this.socket.on('error', this.emit.bind(this, 'error'))
  this.socket.on('data', this._parseMessage.bind(this));
}

util.inherits(Client, EventEmitter);

//connect client to asterisk AMI server
Client.prototype.connect = function(port, host, connectListener) {
  this.socket.connect(port, host, connectListener);
}

//parses raw data coming in off tcp socket
Client.prototype._parseMessage = function(data) {
  var txt = data.toString('utf8');
  var messages = txt.split('\r\n\r\n');
  var self = this;
  //TOD this is ugly, refactor
  messages.map(function(msg) {
    var keyValues = msg.split('\r\n');
    var result = {};
    keyValues.forEach(function(keyValue) {
      if(!keyValue) return;
      var split = keyValue.split(':');
      var key = split[0];
      key = key[0].toLowerCase() + key.substr(1);
      result[key] = 'actionID' === key ? parseInt(split[1]) : split[1].trim();
    })
    return result;
  }).forEach(function(msg){
    self.emit('message', msg);
  })
}

var actionid = 1;
var NEWLINE = '\r\n';
//send a message to the server
Client.prototype.send = function(message) {
  var keys = Object.keys(message);
  var packet = 'ActionID: ' + (actionid++) + NEWLINE;
  for(var i = 0, key; key = keys[i]; i++) {
    //ensure first char is uppercase
    packet += key[0].toUpperCase();
    packet += key.substr(1);
    packet += ': ';
    packet += message[key];
    packet += NEWLINE;
  }
  packet += NEWLINE;
  this.socket.write(packet);
}

Client.prototype.login = function(username, secret, onLogin) {
  var self = this;
  this.send({
    action: 'login',
    username: username,
    secret: secret
  });

  this.socket.once('data', function(data) {
    var result = data.toString('utf8').split('\r\n\r\n')[0];
    if(result.indexOf('Success' > -1)) {
      onLogin();
    } else {
      onLogin(new Error("Something bad happened during login: " + result));
    }
  })
}

ami.Client = Client;

module.exports = ami;
