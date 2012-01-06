[![Build Status](https://secure.travis-ci.org/brianc/node-ami.png)](http://travis-ci.org/brianc/node-ami])

# node-ami

node.js JavaScript client to communicate with an __A__sterisk __M__anager __I__nterface

## install

`npm install ami`

## use

### connect & login
```js

var Client = require('ami').Client;

var port = 5038; //default AMI port
var host = 'localhost';
var client = new Client();
client.connect(port, host, function onConnection(err) {
  if(err) throw err; 

  //create the action you want to send to asterisk
  var login = {
    action: 'login',
    username: 'brian',
    secret: 'shhh!'
  }

  //send it and handle the response
  client.send(login, function(err, response) {

  })
})

```

## more info

Very much a work in progress.  Would love contributions.

## more, more info

Fork & contribute! Open Source is awesome.

## license

[unlicense](http://unlicense.org)
