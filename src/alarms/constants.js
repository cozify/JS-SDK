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

export type ALERT_TYPE = {
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
 "a7fd5286-9649-4967-8b3b-235a05654a87":
      "id":"a7fd5286-9649-4967-8b3b-235a05654a87",
      "error":true,
      "cleared":false,
      "message":"K\u00e4ytt\u00e4j\u00e4tunnus ja salasana eiv\u00e4t kelpaa",
      "realtimeMs":1460110656169,
      "sourceId":"a3f129ee-1991-4932-b7a1-1abce240ae19",
      "timestamp":1460110703049,
      "type":"ALERT"
    "type":"USER_ALERTS"
*/
export type ALERTS_MAP_TYPE = {[alarmId: string]: ALERT_TYPE}
export type HUB_ALERTS_MAP_TYPE = {[hubId: string]: ALERTS_MAP_TYPE}

