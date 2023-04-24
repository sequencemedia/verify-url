/**
 * @module '#verify-url'
 */

/**
 * @typedef {import('#verify-url').Params} Params
 * @typedef {import('#verify-url').RequestFailure} RequestFailure
 * @typedef {import('#verify-url').ResponseFailure} ResponseFailure
 * @typedef {import('#verify-url').ResponseSuccess} ResponseSuccess
 * @typedef {import('#verify-url').VerifyUrlParams} VerifyUrlParams
 */

/**
 * @typedef {Object} DefaultParams
 * @property {string} method
 * @property {string} redirect
 * @property {number} follow
 * @property {boolean} compress
 * @property {number} size
 * @property {boolean} insecureHTTPParser
 */

/**
 * @typedef {DefaultParams & {'User-Agent': string}} RequestParams
 */

import debug from 'debug'

import {
  USER_AGENT,
  TIMEOUT,
  FOLLOW
} from '#config'

import {
  getResponseStatus,
  isResponseStatusRange,
  isResponseStatusSuccessRange
} from '#response-status'

import {
  getErrorCode
} from '#error-code'

import {
  PASS,
  FAIL
} from '#verification'

const log = debug('@sequencemedia/verify-url')

log('`verify-url` is awake')

/**
 * @type {DefaultParams}
 */
const DEFAULT_PARAMS = {
  method: 'GET',
  redirect: 'follow',
  follow: FOLLOW,
  compress: true,
  size: 0,
  insecureHTTPParser: true
}

/**
 * @function getParamm
 * @description Generates parameters for the `fetch` request from configuration parameters
 * @param {DefaultParams} params Configuration parameters
 * @param {AbortSignal} signal An `AbortController` instance `signal` object
 * @returns {RequestParams} Parameters for the `fetch` request
 */
function getParams ({ follow = FOLLOW, userAgent = USER_AGENT }, signal) {
  return (
    Object.assign(DEFAULT_PARAMS, {
      follow,
      signal,
      headers: {
        'User-Agent': userAgent
      }
    })
  )
}

/**
 * @function verifyUrl
 * @description Verifies a URL
 * @param {string} queryUrl A URL (as a string)
 * @param {VerifyUrlParams} params Configuration parameters
 * @returns {Promise<RequestFailure | ResponseFailure | ResponseSuccess>} A description of verification for the URL
 */
export default async function verifyUrl (queryUrl, { timeout = TIMEOUT, ...params } = {}) {
  let url
  let uri

  try {
    url = new URL(queryUrl).toString()
    uri = encodeURI(url)
  } catch ({ message }) {
    return { verification: FAIL, url: queryUrl, error: { code: 'INVALID_URL', message } }
  }

  let responseStatus = null
  let errorCode = null

  const controller = new AbortController()
  const timeoutID = setTimeout(() => {
    controller.abort({ code: 'ECONNABORTED' })
  }, timeout)

  try {
    const response = await fetch(uri, getParams(params, controller.signal))
    responseStatus = getResponseStatus(response)
  } catch (e) {
    errorCode = getErrorCode(e)
  }

  if (!controller.signal.aborted) clearTimeout(timeoutID)

  if (isResponseStatusRange(responseStatus)) {
    if (isResponseStatusSuccessRange(responseStatus)) {
      return { verification: PASS, url: queryUrl }
    }

    return { verification: FAIL, url: queryUrl, response: { status: responseStatus } }
  }

  return { verification: FAIL, url: queryUrl, error: { code: errorCode } }
}
