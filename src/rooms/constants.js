// @flow
export const ROOMS_FI = Object.freeze({
  LIVINGROOM: 'Olohuone',
  BEDROOM: 'Makuuhuone',
  KITCHEN: 'Keittiö',
  HALLWAY: 'Eteinen',
  BATHROOM: 'Kylpyhuone',
});
export type ROOMS_FI_TYPE = $Values<typeof ROOMS_FI>;


export const ROOMS_EN = Object.freeze({
  LIVINGROOM: 'Living Room',
  BEDROOM: 'Bedroom',
  KITCHEN: 'Kitchen',
  HALLWAY: 'Hallway',
  BATHROOM: 'Bathroom',
});
export type ROOMS_EN_TYPE = $Values<typeof ROOMS_EN>;


export type ROOM_TYPE = {
  id: ?string,
  name: ?string,
  order: ?number,
  status: ?Object,
  timestamp: ?number,
  type: ?string
}

export type ROOMS_MAP_TYPE = {[roomId: string]: ROOM_TYPE}

export type HUB_ROOMS_MAP_TYPE = {[hubId: string]: {[roomId: string]: ROOM_TYPE}}
