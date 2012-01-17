var thrift = require('../lib/thrift');
 
var ThriftTest = require('./generated/gen-nodejs/ThriftTest'),
ttypes = require('./generated/gen-nodejs/ThriftTest_types');
Int64 = require('node-int64');
var async = require('async');

var blahstr = '';

var server = thrift.createServer(ThriftTest, {
  testVoid: function(success) {
    success();
  },
  testString: function(thing, success) {
    blahstr = blahstr + thing;
    success(thing);
  },
  testOneway: function(secondsToSleep) {
    onewayfunc();
  }
});

exports['test_reconnect_reopen'] = function(test, assert) {
  test.skip();
  server.listen(9162);
  async.series([
    function(callback) {
      var connection = thrift.createConnection('localhost', 9162),
      client = thrift.createClient(ThriftTest, connection);
      
      client.testVoid(function(err, response) {
        assert.ifError(err);
        connection.end();
        server.close();
        callback();
      });
    },
    function(callback) {
      server.listen(9162);
      var connection = thrift.createConnection('localhost', 9162),
      client = thrift.createClient(ThriftTest, connection);
      
      client.testVoid(function(err, response) {
        assert.ifError(err);
        connection.end();
        callback();
      });
    }
  ], function(err) {
    assert.ifError(err);
    server.close();
    test.finish();
  });
}


exports['test_reconnect'] = function(test, assert) {
  server.listen(9162);
  var connection = thrift.createConnection('localhost', 9162, {autorestart: true}); 
  var client = thrift.createClient(ThriftTest, connection);
  var conncheck = false;
  connection.once('close', function() {
    
    conncheck = true;
  });
  async.series([
    function(callback) {
      client.testString('dead', function(err, response) {
        assert.deepEqual(response,'dead');
        assert.ifError(err);
        connection.connection.destroy();
        callback();
      });
    },
    function(callback) {
      client.testString('cow', function(err, response) {
        assert.deepEqual(response,'cow');
        assert.ifError(err);
        callback();
      });
    },
    function(callback) {
      client.testString('cat', function(err, response) {
        assert.deepEqual(response,'cat');
        assert.ifError(err);
        connection.connection.destroy();
        callback();
      });
    },
    function(callback) {
      client.testString('dog', function(err, response) {
        assert.deepEqual(response,'dog');
        assert.ifError(err);
        callback();
      });
    }
  ], function(err) {
    assert.deepEqual('deadcowcatdog', blahstr);
    assert.ifError(err);
    connection.end();
    server.close();
    test.finish();
  });
}
