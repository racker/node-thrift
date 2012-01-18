
var thrift = require('thrift');
var TMemoryBuffer = thrift.transport.TMemoryBuffer;
var TBinaryProtocol = thrift.protocol.TBinaryProtocol;
var Int64 = require('node-int64');
var async = require('async');

var Telescope = require('./generated/gen-nodejs/tel_types').Telescope;
var AlarmState = require('./generated/gen-nodejs/tel_types').AlarmState;

var binary = require('../lib/thrift/binary');


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

  var transport = new TMemoryBuffer(null, function(message) {
    var input = new TBinaryProtocol(new TMemoryBuffer(message)),
    telescope2 = new Telescope();
    telescope2.read(input);
    assert.deepEqual(telescope,telescope2);
    test.finish();
  });
  output = new TBinaryProtocol(transport);
  telescope.write(output);
  output.flush();
  
};
