var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Action = require(__dirname + '/action');
var Client = function(socket) {
  EventEmitter.call(this);
  this.socket = socket || new require('net').Socket();
  this.socket.on('error', this.emit.bind(this, 'error'))
  this.socket.on('data', this._parseMessage.bind(this));
  //remaining data unparsed from the last packet
  this._lastPacket = '';
}

util.inherits(Client, EventEmitter);

//connect client to asterisk AMI server
Client.prototype.connect = function(port, host, connectListener) {
  this.socket.connect(port, host, connectListener);
}

var MESSAGE_BOUNDARY = /\r\n\r\n/g
//parses raw data coming in off tcp socket
Client.prototype._parseMessage = function(data) {
  //append unparsed last packet data to form working set
  var packet = this._lastPacket + data.toString('utf8');
  var index = 0;
  var messages = packet.split('\r\n\r\n')
  var self = this;
  for(var i = 0, msg; msg = messages[i]; i++) {
    var keyValues = msg.split('\r\n');
    //special case for 'hello' AMI greeting message
    if(keyValues.length === 2 && keyValues[0].indexOf(':') < 0) {
      self.emit('message', keyValues[0]);
      continue;
    }
    var result = {};
    for(var j = 0, keyValue; keyValue = keyValues[j]; j++) {
      var split = keyValue.split(':');
      var key = split[0];
      key = key[0].toLowerCase() + key.substr(1);
      result[key] = 'actionID' === key ? parseInt(split[1]) : split[1].trim();
    }
    self.emit('message', result)
  }
}

//send an action to the server
Client.prototype.send = function(action) {
  if(!(action instanceof Action)) {
    action = new Action(action);
  }
  this.socket.write(action.serialize());
}

Client.prototype.login = function(username, secret, onLogin) {
  var self = this;
  this.send({
    action: 'login',
    username: username,
    secret: secret
  });

  if(!onLogin) return;
  this.socket.once('data', function(data) {
    var result = data.toString('utf8').split('\r\n\r\n')[0];
    if(result.indexOf('Success' > -1)) {
      onLogin();
    } else {
      onLogin(new Error("Something bad happened during login: " + result));
    }
  })
}

module.exports = Client;
