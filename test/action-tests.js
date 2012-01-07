var should = require('should');
var Action = require(__dirname + '/../lib/action');

describe('Action', function() {
  describe('actionID', function(){
    it('auto-increments', function() {
      var action1 = new Action();
      var action2 = new Action();
      var action3 = new Action();
      action1.actionID.should.be.lessThan(action2.actionID);
      action2.actionID.should.be.lessThan(action3.actionID);
    })
  })
  
  describe('serialization', function() {
    it('produces correct result', function() {
      var action = new Action({
        name: 'brian',
        age: 11
      })
      action.serialize().should.equal('Name: brian\r\nAge: 11\r\n\ActionID: ' + action.actionID + '\r\n\r\n');
    })
  })

  describe('receiving', function() {

    describe('succesful response', function() {
      var action = new Action();
      action.actionID = 100;
      var successfulResponse = {
        actionID: action.actionID.toString(), //everything from asterisk is a string
        response: 'Success',
        message: 'message does not matter'
      }

      it('returns true', function() {
        action.receive(successfulResponse).should.equal(true);
      })

      it('calls callback with correct arguments', function(done) {
        action.callback = function(err, msg) {
          should.not.exist(err);
          msg.should.eql(successfulResponse);
          done();
        }

        action.receive(successfulResponse);
      })
    })

    describe('error response', function() {
      var action = new Action();
      action.actionID = 100;
      var errorResponse = {
        response: 'Error',
        actionID: action.actionID.toString(),
        message: 'Authentication failed'
      }

      it('returns true', function() {
        action.receive(errorResponse).should.equal(true);
      })

      it('calls callback with correct arguments', function(done) {
        action.callback = function(err, msg) {
          err.should.eql(errorResponse);
          should.not.exist(msg);
          done();
        }

        action.receive(errorResponse);
      })
    })

    describe('unrelated response', function() {
      var action = new Action();
      action.actionID = 101;

      var res = {
        actionID: '102',
        response: 'Success',
        message: 'whatever'
      }

      it('returns false', function() {
        action.receive(res).should.be.false
      })
    })
  })
})
