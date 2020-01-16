// @flow
//
export const PLAN_NODES = Object.freeze({
  LOCATION: 'LOCATION',
  TEMPLATE: 'TEMPLATE',
  HUB: 'HUB',
});
export type PLAN_NODES_TYPE = $Values<typeof PLAN_NODES>;


export type TEMPLATE_TYPE = {
  id: ?string,
  type: ?string,
  data: Object,
}

export type NODE_TYPE = {
  id: ?string,
  type: ?string,
  data: Object,
  childIds: Array<string>,
}

export type PLANS_TYPE = {
  templates: Object,
  installations: Object,
  locations: NODE_TYPE,
}

