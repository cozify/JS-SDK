// @flow
//
export type DEVICE_TYPE = {
  id: string,
  awayThreshold: ?number,
  capabilities: ?Object,
  groups: ?Object,
  manufacturer: ?string,
  model: ?string,
  name: ?string,
  room: ?Array<Object>,
  state: ?Object,
  timestamp: ?number,
  type: ?string
}

export type DEVICES_MAP_TYPE = {[deviceId: string]: DEVICE_TYPE}

export type HUB_DEVICES_MAP_TYPE = {[hubId: string]: {[deviceId: string]: DEVICE_TYPE}}
