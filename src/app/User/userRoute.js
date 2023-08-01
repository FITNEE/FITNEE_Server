const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../config/jwtMiddleware');
const user = require('./userController');

/**
 * User API
 * /app/user
 */

// 1. Create User (Register) API
router.post('/', user.postUsers);

// 2. User inquiry API (+ search)
router.get('/', user.getUsers);

// 3. Specific User Search API
router.get('/:userId', user.getUserById);

// TODO: After login authentication method (JWT)
// Login API (JWT creation)
router.post('/login', user.login);

// API for modifying member information (JWT verification and validation - using jwtMiddleware in method chaining method)
// jwtMiddleware 사용 방법은 api params에 써주기. -> 로직 보려면 patchUsers 클릭
router.patch('/:userId', jwtMiddleware, user.patchUsers);

// router.get('/auto-login', jwtMiddleware, user.autoLogin)

module.exports = router;

// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API