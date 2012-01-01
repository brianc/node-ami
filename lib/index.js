var ami = {
}

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Client = function(socket) {
  EventEmitter.call(this);
  this.socket = socket || new require('net').Socket();
  var self = this;
  this.socket.on('error', function errorEmitProxy(err){
    self.emit('error', err);
  });
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function(port, host, connectListener) {
  this.socket.connect(port, host, connectListener);
}

var actionid = 1;
Client.prototype.login = function(username, secret, onLogin) {
  var self = this;
  this.socket.write([
                    'ActionID: '+(actionid++),
                    'Action: login',
                    'Username: ' + username,
                    'Secret: ' + secret,
                    '', 
                    ''
  ].join('\r\n'))

  this.socket.once('data', function(data) {
    var result = data.toString('utf8').split('\r\n\r\n')[0];
    self.emit('message', data);
    if(result.indexOf('Success' > -1)) {
      onLogin();
    } else {
      onLogin(new Error("Something bad happened during login: " + result));
    }
  })
}

ami.Client = Client;

module.exports = ami;
return;
