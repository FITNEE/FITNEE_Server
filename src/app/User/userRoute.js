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

// 회원 정보 수정
router.patch('/', jwtMiddleware, user.patchUsers);

// 회원탈퇴 API
router.delete('/', jwtMiddleware, user.deleteUser);

// 최근 로그인한 기기 deviceTocken 저장
router.put('/device', jwtMiddleware, user.deviceToken);

module.exports = router;