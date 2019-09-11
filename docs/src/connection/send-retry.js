// import isRetryAllowed from 'is-retry-allowed';

const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
const ALL_HTTP_METHODS = IDEMPOTENT_HTTP_METHODS.concat(['post']);

/*
 * @param  {Error}  error
 * @return {boolean}

function isNetworkError(error) {
  return (
    !error.response
    && isRetryAllowed(error) // Prevents retrying unsafe errors
    && !(Boolean(error.code) && error.code === 'ECONNABORTED') // Prevents retrying timed out requests
  );
}
*/

/*
 * @param  {Error}  error
 * @return {boolean}
 */
function isRetryableError(error) {
  /*
  return (
    error.code !== 'ECONNABORTED'
    && (!error.response || (error.response.status >= 500 && error.response.status <= 599))
  );
  */
  return (
    (!error.response || (error.response.status >= 500 && error.response.status <= 599))
  );
}

/*
 * @param  {Error}  error
 * @return {boolean}
 */
function isSafeRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }
  return isRetryableError(error) && ALL_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

const httpRetries = {};
const RETRY_COUNT = 1;

export function resetRetry(url) {
  if (httpRetries[url]) {
    httpRetries[url] = 0;
    delete httpRetries[url];
  }
}
/*
 * @param  {Error}  error
 * @return {boolean}
 */
export function retryCondition(error) {
  // if (error.config.url.indexOf('192.168.1.119') !== -1) debugger;
  if (error && error.config && error.config.url) {
    if (httpRetries[error.config.url]) {
      if (httpRetries[error.config.url] >= RETRY_COUNT) {
        httpRetries[error.config.url] = 0;
        return false;
      }
      httpRetries[error.config.url] += httpRetries[error.config.url];
    } else {
      httpRetries[error.config.url] = 1;
    }
  } else {
    console.error('retryCondition unknown', error);
    // Cannot determine if the request can be retried
    return false;
  }

  if (isSafeRequestError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1) {
    console.error('retryCondition condition true', error.config);
  } else {
    console.error('retryCondition condition false', error.config);
    httpRetries[error.config.url] = 0;
  }
  return isSafeRequestError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

/*
 * @param  {Error}  error
 * @return {boolean}
function isNetworkOrIdempotentRequestError(error) {
  return isNetworkError(error) || isIdempotentRequestError(error);
}
 */
