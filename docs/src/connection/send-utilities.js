// 

import {
  CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES, CLOUD_FINGERPRINTS_SHA1, CLOUD_HOST,
} from './constants';
import { isNode } from '../utils';


const SSL_CHECK_INTERVALL = 1000 * 60 * 60; // One hour

/*
 * Returns > 0 if v1 > v2 and < 0 if v1 < v2 and 0 if v1 == v2
 */
function compareVersions(v1, v2) {
  const v1Parts = v1.split('.');
  const v2Parts = v2.split('.');
  const minLength = Math.min(v1Parts.length, v2Parts.length);
  if (minLength > 0) {
    for (let idx = 0; idx < minLength - 1; idx += 1) {
      const diff = Number(v1Parts[idx]) - Number(v2Parts[idx]);
      if (diff !== 0) {
        return diff;
      }
    }
  }
  return v1Parts.length - v2Parts.length;
}

/*
 * Get API version, or given MAX version, from given hubVersion string
 * e.g. 1.12.0.5
 */
export function getAPIversion(hubVersion, maxVersion) {
  let retVal = '0.0';
  const majorEnd = hubVersion.indexOf('.');
  let minorEnd = -1;
  if (majorEnd !== -1) {
    minorEnd = hubVersion.indexOf('.', majorEnd + 1);
  }
  if (minorEnd !== -1) {
    retVal = hubVersion.substring(0, minorEnd);
  }
  if (compareVersions(retVal, maxVersion) > 0) {
    retVal = maxVersion;
  }
  return retVal;
}
/*
 * Return cloud connection state based on error
 */
export function cloudErrorState(error) {
  let retVal = CLOUD_CONNECTION_STATES.UNCONNECTED;
  if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = CLOUD_CONNECTION_STATES.UNAUTHENTICATED;
    console.error('send: authentication error ', error);
  } else if (error && error.response && error.response.status === 403) {
    // 402 Late payment - > no remote access
    retVal = CLOUD_CONNECTION_STATES.LATE_PAYMENT;
    console.error('send: unauhorized error ', error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = CLOUD_CONNECTION_STATES.UNAUTHORIZED;
    console.error('send: unauhorized error ', error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = CLOUD_CONNECTION_STATES.OBSOLETE_API_VERSION;
    console.error('send: version error ', error);
  }

  return retVal;
}


/*
 * Return hub connection state based on given error
 * @param  {Object} error
 * @return {string} hub's connectionState
 */
export function hubErrorState(error) {
  let retVal = HUB_CONNECTION_STATES.UNCONNECTED;
  if (error && error.response && error.response.status === 400) {
    // no connection to offline hub
    console.log('send: no-connection error ', error);
  } else if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = HUB_CONNECTION_STATES.UNAUTHENTICATED;
    console.error('send: authentication error ', error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = HUB_CONNECTION_STATES.UNAUTHORIZED;
    console.error('send: unauhorized error ', error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = HUB_CONNECTION_STATES.OBSOLETE_API_VERSION;
    console.error('send: version error ', error);
  }

  return retVal;
}


let ongoingSSLCertificateCheck = false;
let lastSSLCertificateCheckTime = null;

/*
 * Palceholder function for certificate checker
 * @return {Promise}
 */
export function testSSLCertificate(remoteConnection) {
  return new Promise((resolve) => {
    if (!remoteConnection) {
      // All requests are now complete
      resolve(true);
      return;
    }

    const now = new Date().getTime();
    if (!ongoingSSLCertificateCheck && (!lastSSLCertificateCheckTime || (now - lastSSLCertificateCheckTime > SSL_CHECK_INTERVALL))) {
      ongoingSSLCertificateCheck = true;
      lastSSLCertificateCheckTime = now;

      // Cordova plugin?
      if (!isNode && window && window.plugins && window.plugins.sslCertificateChecker) {
        window.plugins.sslCertificateChecker.check(
          () => {
            ongoingSSLCertificateCheck = false;
            resolve(true);
          },
          (errorMsg) => {
            if (errorMsg === 'CONNECTION_NOT_SECURE') {
              ongoingSSLCertificateCheck = false;
              resolve(false);
            } else {
              ongoingSSLCertificateCheck = false;
              lastSSLCertificateCheckTime = undefined;
              resolve(true);
            }
          },
          CLOUD_HOST,
          CLOUD_FINGERPRINTS_SHA1,
        );
      } else {
        setTimeout(() => { ongoingSSLCertificateCheck = false; }, SSL_CHECK_INTERVALL);
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
}
