namespace cpp telescope.thrift
namespace java telescope.thrift


enum AlarmState {
  OK = 1,
  WARNING = 2,
  CRITICAL = 6
}


struct Telescope
{
  1: string id,
  2: string checkId,
  3: string acctId,
  4: string checkModule,
  5: string entityId,
  6: string target,
  7: i64 timestamp,
  8: i32 consecutiveTrigger = 1,
  14: optional string dimensionKey;
  15: optional string collector;
  17: optional AlarmState criteriaState
  18: optional AlarmState computedState
  19: optional string alarmId
  20: optional byte availability
  21: optional byte state
  22: optional string status
  24: optional string monitoringZoneId
  25: optional string txnId
  26: optional string checkType
  27: optional AlarmState previousKnownState
}
