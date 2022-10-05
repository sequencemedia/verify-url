import superagent from 'superagent'
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

const TIMEOUT = 20000

const REDIRECTS = 200

function ok (response) {
  return isResponseStatusRange(getResponseStatus(response))
}

export default async function verifyUrl (queryUrl) {
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
    /**
     * We're starting with a `HEAD` request
     */
    const response = await (
      superagent
        .head(uri)
        .disableTLSCerts()
        .timeout(TIMEOUT)
        .redirects(REDIRECTS)
        .ok(ok)
    )
    responseStatus = getResponseStatus(response)

    if (responseStatus === 405 || responseStatus === 418) {
      /**
       * We need to null `responseStatus` because the request succeeded
       */
      responseStatus = null

      try {
        /*
         * We're changing to a `GET` request
         */
        const response = await (
          superagent
            .get(uri)
            .disableTLSCerts()
            .timeout(TIMEOUT)
            .redirects(REDIRECTS)
            .ok(ok)
        )
        responseStatus = getResponseStatus(response)
      } catch (e) {
        errorCode = getErrorCode(e)
      }
    }
  } catch (e) {
    errorCode = getErrorCode(e)

    switch (errorCode) {
      case 'ETIMEDOUT':
      case 'ECONNABORTED':
      case 'ECONNRESET':
      case 'ECONNREFUSED':
      case 'ENETRESET':
        /**
         *  We don't need to null `responseStatus` because the request did not succeed
         */

        try {
          /*
           * We're changing to a `GET` request
           */
          const response = await (
            superagent
              .get(uri)
              .disableTLSCerts()
              .timeout(TIMEOUT)
              .redirects(REDIRECTS)
              .ok(ok)
          )
          responseStatus = getResponseStatus(response)
        } catch (e) {
          errorCode = getErrorCode(e)
        }
    }
  }

  if (isResponseStatusRange(responseStatus)) {
    if (isResponseStatusSuccessRange(responseStatus)) {
      return { verification: PASS, url: queryUrl }
    }

    return { verification: FAIL, url: queryUrl, response: { status: responseStatus } }
  }

  return { verification: FAIL, url: queryUrl, error: { code: errorCode } }
}
