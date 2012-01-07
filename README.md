[![Build Status](https://secure.travis-ci.org/brianc/node-ami.png)](http://travis-ci.org/brianc/node-ami])

# node-ami

node.js JavaScript client to communicate with an __A__sterisk __M__anager __I__nterface

## install

`npm install ami`

## use
```js

//require
var Client = require('ami').Client;

var port = 5038; //default AMI port
var host = 'localhost';
var client = new Client();
//connect to AMI server
client.connect(port, host, function onConnection(err) {
  if(err) throw err; 

  //create the login action (plain javascript object)
  var login = {
    action: 'login',
    username: 'brian',
    secret: 'shhh!'
  }

  //send the action to asterisk and handle the response
  client.send(login, function(err, response) {

  })
})

//subscribe to all AMI messages (responses and events)
client.on('message', function(msg) {
  //message will be plain javascript object
  //in the case of our login response message:
  assert.equal(msg.actionID, '0');
  assert.equal(msg.response, 'Success');
  assert.equal(msg.message, 'Authentication accepted');
})

```

## more info

Very much a work in progress.  Would love contributions.

[AMI documentation](http://www.voip-info.org/wiki/view/Asterisk+manager+API)

## more, more info

Fork & contribute! Open Source is awesome.

## license

[unlicense](http://unlicense.org)
