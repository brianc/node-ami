var NEWLINE = '\r\n';

var Action = function(data) {
  this.data = data || {};
  this.actionID = this.data.actionID = Action.lastActionID++;
}

Action.lastActionID = 0;

Action.prototype.serialize = function() {
  var keys = Object.keys(this.data);
  var packet = '';
  for(var i = 0, key; key = keys[i]; i++) {
    //ensure first char is uppercase
    packet += key[0].toUpperCase();
    packet += key.substr(1);
    packet += ': ';
    packet += this.data[key];
    packet += NEWLINE;
  }
  packet += NEWLINE;
  return packet;
}

module.exports = Action;
