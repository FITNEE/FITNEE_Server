const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const user = require('./userController');

/**
 * User API
 * /app/user
 */

// 1. 회원가입
router.post('/', user.postUsers);

// 2. 유저 조희
router.get('/', user.getUsers);

// 3. 특정 유저 조희
router.get('/:userId', user.getUserById);

// 로그인
router.post('/login', user.login);

// 자동로그인
router.post('/check', jwtMiddleware, user.check);

// API for modifying member information (JWT verification and validation - using jwtMiddleware in method chaining method)
// jwtMiddleware 사용 방법은 api params에 써주기. -> 로직 보려면 patchUsers 클릭
// 회원 정보 수정
router.patch('/', jwtMiddleware, user.patchUsers);

// 회원탈퇴 API
router.delete('/', jwtMiddleware, user.deleteUser);

module.exports = router;