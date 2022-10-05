const {
  env: {
    NODE_ENV = 'development'
  }
} = process

function env () {
  return (
    NODE_ENV === 'production'
  )
}

const presets = [
  [
    '@babel/env', {
      targets: {
        node: 'current'
      },
      useBuiltIns: 'usage',
      corejs: 3
    }
  ]
]

const plugins = [
  [
    'minify-dead-code-elimination',
    {
      optimizeRawSize: true
    }
  ],
  [
    'module-resolver',
    {
      root: ['./src'],
      cwd: 'babelrc',
      alias: {
        '#verify-url': './lib/erify-url.cjs',
        '#response-status': './lib/response-status.cjs',
        '#error-code': './lib/error-code.cjs',
        '#verification': './lib/verification.cjs'
      }
    }
  ]
]

module.exports = (api) => {
  if (api) api.cache.using(env)

  return {
    presets,
    plugins
  }
}
