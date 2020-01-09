// @flow
export type ALARM_TYPE = {
  id: ?string,
  level: ?string,
  message: string,
  messageHTML: ?string,
  messageTxt: ?string,
  remove: ?number,
  name: ?string,
  closed: ?boolean,
  sourceId: ?string,
  timestamp: ?number,
  title: ?string,
  type: ?string
}
/*
closed: false
createdAtMs: 1573477740542
id: "f9fbd96b-f436-44f8-ba11-4be7aee1238a"
level: "err"
// eslint-disable-next-line
message: ""
name: "LT Security Alarm"
sourceId: "b0d685d8-5270-411b-8d1e-2c45c31c8f07"
timestamp: 1573477740542
title: "Murtohälytys"
type: "USER_ALARM"
*/

export type ALARMS_MAP_TYPE = {[alarmId: string]: ALARM_TYPE}

export type HUB_ALARMS_MAP_TYPE = {[hubId: string]: ALARMS_MAP_TYPE}
