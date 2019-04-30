// 

import { CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES, CLOUD_FINGERPRINTS_SHA1, CLOUD_HOST } from './constants'
import { isNode } from '../utils.js'


const SSL_CHECK_INTERVALL = 1000 * 60  * 60 //One hour


 /*
 * Return cloud connection state based on error
 */
export function cloudErrorState(error) {
  let retVal = CLOUD_CONNECTION_STATES.UNCONNECTED
  if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = CLOUD_CONNECTION_STATES.UNAUTHENTICATED
    console.error("send: authentication error ", error);
  } else if (error && error.response && error.response.status === 403) {
    // 402 Late payment - > no remote access
    retVal = CLOUD_CONNECTION_STATES.LATE_PAYMENT
    console.error("send: unauhorized error ", error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = CLOUD_CONNECTION_STATES.UNAUTHORIZED
    console.error("send: unauhorized error ", error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = CLOUD_CONNECTION_STATES.OBSOLETE_API_VERSION
    console.error("send: version error ", error);
  }

  return retVal
}


/*
 * Return hub connection state based on given error
 * @param  {Object} error
 * @return {string} hub's connectionState
 */
export function hubErrorState(error) {
  let retVal = HUB_CONNECTION_STATES.UNCONNECTED
  if (error && error.response && error.response.status === 400) {
    // no connection to offline hub
    console.log("send: no-connection error ", error);
  } else if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = HUB_CONNECTION_STATES.UNAUTHENTICATED
    console.error("send: authentication error ", error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = HUB_CONNECTION_STATES.UNAUTHORIZED
    console.error("send: unauhorized error ", error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = HUB_CONNECTION_STATES.OBSOLETE_API_VERSION
    console.error("send: version error ", error);
  }

  return retVal
}


let _ongoingSSLCertificateCheck = false;
let _lastSSLCertificateCheckTime = null;

/*
 * Palceholder function for certificate checker
 * @return {Promise}
 */
export function testSSLCertificate(remoteConnection) {
  return new Promise( (resolve, reject) => {

    if(!remoteConnection) {
      // All requests are now complete
      resolve(true);
      return;
    }

    let now = new Date().getTime()
    if (!_ongoingSSLCertificateCheck && ( !_lastSSLCertificateCheckTime || (now - _lastSSLCertificateCheckTime  >  SSL_CHECK_INTERVALL ) ) ){
      _ongoingSSLCertificateCheck = true
      _lastSSLCertificateCheckTime = now

      // Cordova plugin?
      if (!isNode && window && window.plugins && window.plugins.sslCertificateChecker) {
          window.plugins.sslCertificateChecker.check(
              (successMsg) => {
                  _ongoingSSLCertificateCheck = false;
                  resolve(true);
              }
              ,(errorMsg) => {
                  if (errorMsg === "CONNECTION_NOT_SECURE") {
                    _ongoingSSLCertificateCheck = false
                    resolve(false);
                  }
                  else{
                    _ongoingSSLCertificateCheck = false
                    _lastSSLCertificateCheckTime = undefined
                    resolve(true);
                  }
              }
              , CLOUD_HOST
              , CLOUD_FINGERPRINTS_SHA1
          )
      } else {
          setTimeout(function() {_ongoingSSLCertificateCheck = false}, SSL_CHECK_INTERVALL);
          resolve(true);
      }
    } else {
      resolve(true);
    }

  });

}




