// @flow
export const PLAN_NODES = Object.freeze({
  LOCATION: 'LOCATION',
  TEMPLATE: 'TEMPLATE',
  HUB: 'HUB',
});

export type PLAN_NODES_TYPE = $Values<typeof PLAN_NODES>;

export const DUMMY = Object.freeze({
  DUMMY: 'DUMMY',
});

export type TEMPLATE_TYPE = {
  id: ?string,
  type: ?string,
  data: Object,
}

type NODE_ROOT_TYPE = {
  id: ?string,
  type: ?string,
  data: Object,
  childIds: Array<string>,
}

export type ROOT_NODE_TYPE = {
  root: NODE_ROOT_TYPE,
}

export type PLAN_TYPE = {
  uid: string,
  name: ?string,
  created_at: string,
  changed_at: string,
}

export type PLANS_TYPE = {[uid: string]: PLAN_TYPE}

export type NODE_TYPE = {
  uid: string,
  name: ?string,
  created_at: string,
  changed_at: string,
  data: Object,
}

export type NODES_TYPE = {[uid: string]: NODE_TYPE}


export type DOCUMENT_TYPE = {
  uid: string,
  name: ?string,
  plan_id: string,
  created_at: string,
  changed_at: string,
}
