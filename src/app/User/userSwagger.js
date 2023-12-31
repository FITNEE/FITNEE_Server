/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /app/test:
 *   get:
 *     summary: 테스트 API
 *     description: 서버 응답을 테스트하는 API
 *     tags:
 *       - Users
 *     responses:
 *       "1000":
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     # 필요에 따라 응답 데이터 속성 추가
 *                     # 예: 이메일, 비밀번호, 닉네임 등
 */

/**
 * @swagger
 * /app/users:
 *   get:
 *     summary: 유저 조회 API
 *     description: 파라미터 값으로 유저를 조회하는 API
 *     tags:
 *       - Users
 *     responses:
 *       "1000":
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     # 필요에 따라 응답 데이터 속성 추가
 *                     # 예: 이메일, 비밀번호, 닉네임 등
 *       "3003":
 *         description: 존재하지 않는 이메일입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     # 필요에 따라 응답 데이터 속성 추가
 *                     # 예: 이메일, 비밀번호, 닉네임 등
 */

/**
 * @swagger
 * /app/users:
 *   post:
 *     summary: 유저 생성 (회원가입) API (아직 실행 안됨)
 *     description: 새로운 사용자를 생성하는 API (회원 가입)
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자의 이메일 주소
 *               userPw:
 *                 type: string
 *                 description: 사용자의 비밀번호
 *               nickname:
 *                 type: string
 *                 description: 사용자의 닉네임
 *     responses:
 *       "200":
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     # 필요에 따라 응답 데이터 속성 추가
 *                     # 예: userId, 이메일, 닉네임 등
 */

// ... (다른 API들도 같은 방식으로 작성합니다)

