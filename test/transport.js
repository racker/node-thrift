
var thrift = require('thrift');
var TBufferedTransport = thrift.transport.TBufferedTransport;
var TFramedTransport = thrift.transport.TFramedTransport;
var TBinaryProtocol = thrift.protocol.TBinaryProtocol;
var Int64 = require('node-int64');
var async = require('async');

var Telescope = require('./generated/gen-nodejs/tel_types').Telescope;
var AlarmState = require('./generated/gen-nodejs/tel_types').AlarmState;

var binary = require('../lib/thrift/binary');

exports['test_binary_transport'] = function(test, assert) {
  var transport = new TBufferedTransport(null, function(message) {
    TBufferedTransport.receiver(function(input) {
      assert.deepEqual(input.readByte(),1);
      assert.deepEqual(input.readI16(),2490);
      assert.deepEqual(input.readI32(),91199);
      test.finish();
    })(message);
  });
  transport.write(new Buffer([1]));
  transport.write(binary.writeI16(new Buffer(2), 2490));
  transport.write(binary.writeI32(new Buffer(4), 91199));
  transport.flush();
};


exports['test_binary_write'] = function(test, assert) {
  var transport = new TBufferedTransport(null, function(message) {
    TBufferedTransport.receiver(function(input) {
      var type = input.readByte();
      var id = input.readI16();
      assert.deepEqual(type,thrift.Thrift.Type.STRING);
      assert.deepEqual(id,1);
      var len = input.readI32();
      var str = input.readString(len);
      assert.deepEqual('blah',str);
      type = input.readByte();
      assert.deepEqual(type, thrift.Thrift.Type.STOP);
      test.finish();
    })(message);
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
