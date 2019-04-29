// @flow

import { connectionsState, connectionsReducer } from "../reducers/connections";
import { hubsState, hubsReducer } from "../reducers/hubs"
import { store } from "../store"
import { HUB_CONNECTION_STATES } from './constants'
import type { CLOUD_CONNECTION_STATE_TYPE, HUB_CONNECTION_STATE_TYPE } from './constants';

/**
 * Change Cloud connection state
 * @param {[type]} value: CLOUD_CONNECTION_STATE_TYPE [description]
 */
export function setCloudConnectionState(value: CLOUD_CONNECTION_STATE_TYPE) {
    store.dispatch(connectionsState.actions.setCloudConnectionState(value));
}

export function getCloudConnectionState(): CLOUD_CONNECTION_STATE_TYPE{
  const stateNow = store.getState();
  return connectionsState.selectors.getConnections(stateNow).cloudState;
}

/**
 * Change hub connection state
 * @param {hubId: string, state: HUB_CONNECTION_STATE_TYPE} hubAndState hubId and new state
 */
export function setHubConnectionState(hubAndState: {hubId: string, state: HUB_CONNECTION_STATE_TYPE}) {
    const stateNow = store.getState()
    const storedHubs = hubsState.selectors.getHubs(stateNow)
    /* If hub is unconnected, lets try remote */
    if (hubAndState.state === HUB_CONNECTION_STATES.UNCONNECTED && storedHubs[hubAndState.hubId]){
      if (storedHubs[hubAndState.hubId].connectionState === HUB_CONNECTION_STATES.REMOTE){
        hubAndState.state = HUB_CONNECTION_STATES.LOCAL
      }
    }
    store.dispatch(hubsState.actions.setHubConnectionState(hubAndState));
}
/**
 * Get hub connection state by hub id
 * @param  {string} hubId
 * @return {HUB_CONNECTION_STATE_TYPE}
 */
export function getHubConnectionState(hubId:string): HUB_CONNECTION_STATE_TYPE {
  const stateNow = store.getState();
  if (hubsState.selectors.getHubs(stateNow)[hubId]){
    return hubsState.selectors.getHubs(stateNow)[hubId].connectionState;
  }
  return HUB_CONNECTION_STATES.UNCONNECTED
}


