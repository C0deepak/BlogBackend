const express = require('express')
const { registerUser, loginUser, logoutUser, detailUser, followUser } = require('../controller/userController')
const { isAuthenticatedUser } = require('../middleware/auth')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/me').get(isAuthenticatedUser, detailUser)
router.route('/follow').post(isAuthenticatedUser, followUser)

module.exports = router