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
message: "PGRpdiBjbGFzcz0iaGVhZGVyIj48aDIgY2xhc3M9InRpdGxlIj5NdXJ0b2jDpGx5dHlzITwvaDI+PC9kaXY+CiAgPGRpdiBjbGFzcz0iZGV2aWNlSWNvbnMiPjxkaXYgY2xhc3M9ImRldmljZSB0ZXh0LWNlbnRlciI+CjxkaXYgY2xhc3M9ImNvbnRhaW5lciI+CjxpIGNsYXNzPSJib3JkZXIgaWNvbi1kZXZpY2UtY2lyY2xlIj48L2k+CjxpIGNsYXNzPSJpY29uIGljb24tbW90aW9uZGV0ZWN0b3IiPjwvaT4KPC9kaXY+CjxkaXYgY2xhc3M9Im5hbWUiPkxpaWtldHTDpCBtYWtrYXJpc3NhITwvZGl2Pgo8L2Rpdj4KICAgIDxkaXYgY2xhc3M9ImNsZWFyZXIiPjwvZGl2PgogIDwvZGl2PgogIDxkaXYgY2xhc3M9Im5vdGlmaWNhdGlvbkNvbnRlbnQiPgogICAgPGgxPk11cnRvaMOkbHl0eXM8L2gxPgogICAgPHA+QXN1bm5vc3Nhc2kgb24gaGF2YWl0dHUgbGlpa2V0dMOkLiBUYXJraXN0YSB0aWxhbm5lIGthbWVyYW4gYXZ1bGxhIGphIHNvaXRhIHRhcnZpdHRhZXNzYSBow6R0w6RudW1lcm9vbiAxMTIuPC9wPgogICAgPGEgaHJlZj0idGVsOjExMiIgY2xhc3M9ImJ1dHRvbiB0cmFuc3BhcmVudCI+CiAgICAgIDxkaXYgY2xhc3M9Im1ha2VDYWxsIj5Tb2l0YSAxMTI8L2Rpdj4KICAgIDwvYT4KICA8L2Rpdj48L2Rpdj4="
name: "LT Security Alarm"
sourceId: "b0d685d8-5270-411b-8d1e-2c45c31c8f07"
timestamp: 1573477740542
title: "Murtohälytys"
type: "USER_ALARM"
*/

export type ALARMS_MAP_TYPE = {[alarmId: string]: ALARM_TYPE}

export type HUB_ALARMS_MAP_TYPE = {[hubId: string]: ALARMS_MAP_TYPE}
