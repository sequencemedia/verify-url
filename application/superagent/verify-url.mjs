import superagent from 'superagent'

/**
 * @typedef {import('superagent').Response} SuperAgentResponse
 * @typedef {import('#superagent/verify-url').Params} Params
 * @typedef {import('#superagent/verify-url').RequestFailure} RequestFailure
 * @typedef {import('#superagent/verify-url').ResponseFailure} ResponseFailure
 * @typedef {import('#superagent/verify-url').ResponseSuccess} ResponseSuccess
 * @typedef {import('#superagent/verify-url').VerifyUrlParams} VerifyUrlParams
 */

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

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'

const TIMEOUT = 5000

const REDIRECTS = 200

/**
 * @function ok
 * @description Determines whether the response status is within an expected range
 * @param {SuperAgentResponse} response A `superagent` response
 * @returns {boolean} Whether the status is within the expected range
 */
function ok (response) {
  return isResponseStatusRange(getResponseStatus(response))
}

/**
 * @function verifyUrl
 * @description Verifies a URL
 * @param {string} queryUrl A URL (as a string)
 * @param {VerifyUrlParams} params Configuration parameters
 * @returns {Promise<RequestFailure | ResponseFailure | ResponseSuccess>} A description of verification for the URL
 */
export default async function verifyUrl (queryUrl, { timeout = TIMEOUT, userAgent = USER_AGENT } = {}) {
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

  try {
    const response = await (
      superagent
        .get(uri)
        .set('User-Agent', userAgent)
        .disableTLSCerts()
        .timeout(timeout)
        .redirects(REDIRECTS)
        .ok(ok)
    )
    responseStatus = getResponseStatus(response)
  } catch (e) {
    errorCode = getErrorCode(e)
  }

  if (isResponseStatusRange(responseStatus)) {
    if (isResponseStatusSuccessRange(responseStatus)) {
      return { verification: PASS, url: queryUrl }
    }

    return { verification: FAIL, url: queryUrl, response: { status: responseStatus } }
  }

  return { verification: FAIL, url: queryUrl, error: { code: errorCode } }
}
