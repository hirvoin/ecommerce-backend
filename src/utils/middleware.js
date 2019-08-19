const logger = (request, response, next) => {
  if (process.env.NODE_ENV === 'test ') {
    return next()
  }
  const authorization = request.get('authorization')
  console.log('---')
  console.log('Method: ', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('Authorization status: ', authorization)
  console.log('---')
  return next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    return next()
  }
  return next()
}

module.exports = { logger, tokenExtractor }
