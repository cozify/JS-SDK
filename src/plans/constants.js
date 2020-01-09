// @flow
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
