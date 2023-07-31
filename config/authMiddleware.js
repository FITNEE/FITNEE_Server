const jwt = require('jsonwebtoken')
const secret_config = require('./secret')
const { errResponse } = require('./response')
const baseResponseStatus = require('./baseResponseStatus')

const authenticateUserWithCookie = (req, res, next) => {
	const accesstoken = req.cookie.accessToken

	if (!accesstoken) {
		return res.send(errResponse(baseResponseStatus.TOKEN_EMPTY))
	}

	jwt.verify(accesstoken, secret_config.jwtsecret, (err, decoded) => {
		if (err) {
			return res.send(errResponse(baseResponseStatus.TOKEN_VERIFICATION_FAILURE))
		}

		const userId = decoded.userId
		req.userId = userId
		next()
	})
}