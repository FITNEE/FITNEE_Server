const express = require('express');
const router = express.Router();
const user = require('./userController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

// 0. Test API
router.get('/test', user.getTest);

// 1. Create User (Register) API
router.post('/user', user.postUsers);

// 2. User inquiry API (+ search)
router.get('/user', user.getUsers);

// 3. Specific User Search API
router.get('/user/:userId', user.getUserById);

// TODO: After login authentication method (JWT)
// Login API (JWT creation)
router.post('/user/login', user.login);

// API for modifying member information (JWT verification and validation - using jwtMiddleware in method chaining method)
// jwtMiddleware 사용 방법은 api params에 써주기. -> 로직 보려면 patchUsers 클릭
router.patch('/user/:userId', jwtMiddleware, user.patchUsers);


// module.exports = function(app){
//     const user = require('./userController');
//     const jwtMiddleware = require('../../../config/jwtMiddleware');

//     // 0. 테스트 API
//     app.get('/app/test', user.getTest)

//     // 1. 유저 생성 (회원가입) API
//     app.post('/app/users', user.postUsers);

//     // 2. 유저 조회 API (+ 검색)
//     app.get('/app/users',user.getUsers); 

//     // 3. 특정 유저 조회 API
//     app.get('/app/users/:userId', user.getUserById);


//     // TODO: After 로그인 인증 방법 (JWT)
//     // 로그인 하기 API (JWT 생성)
//     app.post('/app/user/login', user.login);

//     // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
//     app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)
// };

module.exports = router

// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API