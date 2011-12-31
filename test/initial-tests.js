var ami = require(__dirname + '/../lib');

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var MockSocket = function() {
  EventEmitter.call(this);
  this.data = [];
}

util.inherits(MockSocket, EventEmitter);

MockSocket.prototype.connect = function(port, host, connectListener) {
  this.port = port;
  if('function' === typeof host) {
    connectListener = host;
  }
  else if('function' === typeof connectListener) {
    this.on('connect', connectListener);
  }
  this.host = host;
}

MockSocket.prototype.write = function(data) {
  this.data.push(data);
}

describe('ami.Client', function() {
  describe('connection', function() {
    describe('success', function() {
      var socket = new MockSocket();
      var client = new ami.Client(socket);
      var port = 5038;
      var host = 'localhost';

      before(function(done) {
        client.connect(port, host, done);
        process.nextTick(function() {
          socket.emit('connect');
        })
      })

      it('sets socket properties', function() {
        client.socket.port.should.equal(5038);
        client.socket.host.should.equal('localhost');
      })

    })

    describe('error', function() {
      var socket = new MockSocket();
      var client = new ami.Client(socket);
      var port = 5038;
      var host = 'localhost';
      
      it('emits error', function(done) {
        client.connect(1234);
        client.on('error', function() {
          done();
        });
        process.nextTick(function() {
          socket.emit('error', new Error("fake error"));
        })
      })
      
    })

  })

  describe('login', function() {
    describe('sent packet', function() {
      var socket = new MockSocket();
      var client = new ami.Client(socket);
      client.login('user', 'pass', function() {
      });
      it('has correct information', function() {
        socket.data[0].should.equal([
                                    'ActionID: 1',
                                    'Action: login',
                                    'Username: user',
                                    'Secret: pass','',''].join('\r\n'))
      })
    })

    describe('success', function() {
      var socket = new MockSocket();
      var client = new ami.Client(socket);

      it('fires callback without error', function(done) {
        client.login('user', 'pass', done);
        process.nextTick(function(){
          socket.emit('data',Buffer([
                                    'Response: Success',
                                    'ActionID: 1',
                                    'Message: Authentication accepted',
                                    ''
          ].join('\r\n'),'utf8'))
        })
      })
    })
  })
})
