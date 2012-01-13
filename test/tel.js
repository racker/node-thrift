
var thrift = require('thrift');
var TBufferedTransport = thrift.transport.TBufferedTransport;
var TFramedTransport = thrift.transport.TFramedTransport;
var TBinaryProtocol = thrift.protocol.TBinaryProtocol;
var Int64 = require('node-int64');
var async = require('async');

var Telescope = require('./generated/gen-nodejs/tel_types').Telescope;
var AlarmState = require('./generated/gen-nodejs/tel_types').AlarmState;

var binary = require('../lib/thrift/binary');

exports['test_telescope_buffered'] = function(test, assert) {
  var telescope = new Telescope({
    acctId: 'acOneTwo',
    entityId: 'enOneTwo',
    checkId: 'chOneTwo',
    timestamp: new Int64(Date.now()),
    computedState: AlarmState.WARNING,
    alarmId: 'alOneTwo',
    txnId: 'sometransaction',
    analyzedByMonitoringZoneId: 'DFW'
  });

  var transport = new TBufferedTransport(null, function(message) {
    TBufferedTransport.receiver(function(inbuff) {
      var input = new TBinaryProtocol(inbuff),
          telescope2 = new Telescope();
      telescope2.read(input);
      assert.deepEqual(telescope,telescope2);
      test.finish();
    })(message);
  });
  output = new TBinaryProtocol(transport);
  telescope.write(output);
  output.flush();
  
};

exports['test_telescope_framed'] = function(test, assert) {
  var telescope = new Telescope({
    acctId: 'acOneTwo',
    entityId: 'enOneTwo',
    checkId: 'chOneTwo',
    timestamp: new Int64(Date.now()),
    computedState: AlarmState.WARNING,
    alarmId: 'alOneTwo',
    txnId: 'sometransaction',
  });

  var transport = new TFramedTransport(null, function(message) {
    TFramedTransport.receiver(function(inbuff) {
      var input = new TBinaryProtocol(inbuff),
          telescope2 = new Telescope();
      telescope2.read(input);
      assert.deepEqual(telescope,telescope2);
      test.finish();
    })(message);
  });
  output = new TBinaryProtocol(transport);
  telescope.write(output);
  output.flush();
  
};
