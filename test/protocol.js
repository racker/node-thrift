
var thrift = require('thrift');
var TMemoryBuffer = thrift.transport.TMemoryBuffer;
var TBinaryProtocol = thrift.protocol.TBinaryProtocol;
var Int64 = require('node-int64');
var async = require('async');

var Telescope = require('./generated/gen-nodejs/tel_types').Telescope;
var AlarmState = require('./generated/gen-nodejs/tel_types').AlarmState;

var binary = require('../lib/thrift/binary');


exports['test_binary_protocol'] = function(test, assert) {
  var transport = new TMemoryBuffer(null, function(message) {
    var input = new TBinaryProtocol(new TMemoryBuffer(message))
    input.readStructBegin();
    var ret = input.readFieldBegin();
    assert.deepEqual(ret.fid, 1);
    var str = input.readString();
    assert.deepEqual('blah',str);
    input.readFieldEnd();
    ret = input.readFieldBegin();
    assert.deepEqual(ret.ftype, thrift.Thrift.Type.STOP);
    input.readStructEnd();
    test.finish();
  });
  var output = new TBinaryProtocol(transport);
  output.writeStructBegin('dummytel');
  output.writeFieldBegin('id', thrift.Thrift.Type.STRING, 1);
  output.writeString('blah');
  output.writeFieldEnd();
  output.writeFieldStop();
  output.writeStructEnd();
  output.flush();
};
