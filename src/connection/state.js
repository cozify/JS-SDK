// @flow

import { connectionsState, connectionsReducer } from "../reducers/connections";
import { hubsState, hubsReducer } from "../reducers/hubs"
import { getStore } from "../store"
import { HUB_CONNECTION_STATES } from './constants'
import type { CLOUD_CONNECTION_STATE_TYPE, HUB_CONNECTION_STATE_TYPE } from './constants';
/**
 * Change Cloud connection state
 * @param {[type]} value: CLOUD_CONNECTION_STATE_TYPE [description]
 */
export function setCloudConnectionState(value: CLOUD_CONNECTION_STATE_TYPE) {
    getStore().dispatch(connectionsState.actions.setCloudConnectionState(value));
}

export function getCloudConnectionState () {
  const stateNow = getStore().getState();
  return connectionsState.selectors.getConnections(stateNow).cloudState;
}

/**
 * Change hub connection state
 * @param {Object} hubAndState hubId and new state
 */
export function setHubConnectionState(hubAndState) {
    const stateNow = getStore().getState()
    const storedHubs = hubsState.selectors.getHubs(stateNow)
    /* If hub is unconnected, lets try remote */
    if (hubAndState.state === HUB_CONNECTION_STATES.UNCONNECTED && storedHubs[hubAndState.hubId]){
      if (storedHubs[hubAndState.hubId].connectionState === HUB_CONNECTION_STATES.REMOTE){
        hubAndState.state = HUB_CONNECTION_STATES.LOCALE
      }
    }
    getStore().dispatch(hubsState.actions.setHubConnectionState(hubAndState));
}

export function getHubConnectionState (hubId) {
  const stateNow = getStore().getState();
  if (hubsState.selectors.getHubs(stateNow)[hubId]){
    return hubsState.selectors.getHubs(stateNow)[hubId].connectionState;
  }
  return HUB_CONNECTION_STATES.UNCONNECTED
}
