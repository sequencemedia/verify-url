import debug from 'debug'
import 'dotenv/config'
import nconf from 'nconf'
import {
  join
} from 'node:path'

import PATH from '../where-am-i.mjs'

const log = debug('@sequencemedia/verify-url')
const error = debug('@sequencemedia/verify-url:error')

log('`config` is awake')

try {
  nconf
    .env()
    .argv()
    .file({
      file: nconf.get('file') || join(PATH, 'defaults.json')
    })
    .required([
      'USER_AGENT',
      'TIMEOUT',
      'FOLLOW'
    ])
} catch ({
  message = 'N/A'
}) {
  error(message)

  process.exit(1)
}

const {
  USER_AGENT,
  TIMEOUT,
  FOLLOW
} = nconf.get()

export {
  USER_AGENT,
  TIMEOUT,
  FOLLOW
}
