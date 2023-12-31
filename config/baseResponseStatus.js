module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    // 3xx: Empthy value
    EMPTY_ID: { isSuccess: true, code: 300, message: "ID is required." },
    EMPTY_PASSWORD: { isSuccess: true, code: 301, message: "Password is required." },
    EMPTY_NAME: { isSuccess: true, code: 302, message: "User name is required." },
    EMPTY_USERID: { isSuccess: true, code: 303, message: "User UserId is required." },
    EMPTY_NICKNAME: { isSuccess: true, code: 304, message: "User nickname is required." },
    EMPTY_ADDRESSIDX: { isSuccess: true, code: 305, message: "AddressIdx is required." },
    EMPTY_SUBADDRESSIDX: { isSuccess: true, code: 306, message: "subAddressIdx is required." },
    EMPTY_ADDRESSTYPE: { isSuccess: true, code: 307, message: "Address type is required." },
    EMPTY_INFO_TO_UPDATE: { isSuccess: true, code: 308, message: "There is no info to update." },
    EMPTY_TITLE: { isSuccess: true, code: 309, message: "Title is required." },
    EMPTY_CATEGORYIDX: { isSuccess: true, code: 310, message: "CategoryIdx is required." },
    EMPTY_CONTENT: { isSuccess: true, code: 311, message: "Content is required." },
    EMPTY_SEARCH_RANGE: { isSuccess: true, code: 312, message: "Range is required." },
    
    LENGTH_ID: { isSuccess: true, code: 313, message: "User ID should be shorter then 20 charaters." },
    LENGTH_PASSWORD: { isSuccess: true, code: 314, message: "User password should be longer than 6 and shorter then 20 charaters." },
    LENGTH_NAME: { isSuccess: true, code: 315, message: "User name should be shorter then 24 charaters." },
    LENGTH_NICKNAME: { isSuccess: true, code: 316, message: "User name should be shorter then 24 charaters." },
    LENGTH_PHOTO: { isSuccess: true, code: 317, message: "Photos can be uploaded less than 10 photos" },
    
    //calendar error
    CALENDAR_USERID_EMPTY : { "isSuccess": false, "code": 501, "message":"userIdx를 입력해주세요" },
    CALENDAR_MONTH_EMPTY : { "isSuccess": false, "code": 502, "message":"달을 입력해 주세요." },

    //gender, height, weight, birthyear error
    EMPTY_GENDER: { isSuccess: true, code: 318, message: "성별을 입력해주세요." },
    EMPTY_HEIGHT: { isSuccess: true, code: 319, message: "키를 입력해주세요." },
    EMPTY_WEIGHT: { isSuccess: true, code: 320, message: "몸무게를 입력해주세요." },
    EMPTY_BIRTHYEAR: { isSuccess: true, code: 321, message: "생년월일을 입력해주세요." },
    
    INVALID_GENDER: { isSuccess: true, code: 322, message: "남/녀 중에 하나를 선택하세요." },
    INVALID_HEIGHT: { isSuccess: true, code: 323, message: "몸무게를 제대로 선택하세요." },
    INVALID_WEIGHT: { isSuccess: true, code: 324, message: "키를 제대로 선택하세요." },

    //dictionary error
    DICTIONARY_PARTS_EMPTY : { "isSuccess": false, "code": 601, "message":"운동부위를 입력해 주세요." },
    DICTIONARY_NAME_EMPTY : { "isSuccess": false, "code": 602, "message":"운동종목을 입력해 주세요." },
    DICTIONARY_USERNICKNAME_EMPTY : { "isSuccess": false, "code": 603, "message":"유저 닉네임을 입력해 주세요." },
    DICTIONARY_TEXT_EMPTY : { "isSuccess": false, "code": 604, "message":"채팅내용을 입력해 주세요." },
    DICTIONARY_HEALTHCHATTINGIDX_EMPTY: { "isSuccess": false, "code": 605, "message":"app/dictionary/exercisechat에서 get한 healthChattingIdx를 입력해 주세요." },
    DICTIONARY_SEARCH_EMPTY : { "isSuccess": false, "code": 606, "message":"검색내용을 입력해 주세요." },
    DICTIONARY_HEALTHCHATTINGIDX2_EMPTY: { "isSuccess": false, "code": 607, "message":"현재 채팅방의 가장 마지막 채팅의 healthChattingIdx를 입력해 주세요." },    

    //mypage error
    MYPAGE_USERNICKNAME_EMPTY: { "isSuccess": false, "code": 701, "message":"수정할 userNickname을 입력해 주세요." },
    MYPAGE_BIRTHYEAR_EMPTY: { "isSuccess": false, "code": 702, "message":"수정할 birthYear를 입력해 주세요." },
    MYPAGE_USERPW_EMPTY: { "isSuccess": false, "code": 703, "message":"수정할 userPw를 입력해 주세요." },   
    MYPAGE_USERPW_EQUAL: { "isSuccess": false, "code": 704, "message":"수정할 userPw와 기존 userPw가 동일합니다." },
    MYPAGE_USERNICKNAME_EQUAL: { "isSuccess": false, "code": 705, "message":"수정할 userNickname과 동일한 userNickname이 존재합니다." },
    // 706은 mypage api no.8에만 쓸것. 그냥 동일은 704번
    MYPAGE_USERPW_EQUAL2: { "isSuccess": true, "code": 706, "message":"입력한 userPw와 기존 userPw가 동일합니다." },
    //
    MYPAGE_USERPW_UNEQUAL: { "isSuccess": false, "code": 707, "message":"입력한 userPw와 기존 userPw가 동일하지 않습니다." },
    MYPAGE_DATE_INVALID: { "isSuccess": false, "code": 708, "message":"유효하지 않은 날짜 형식입니다." },
    MYPAGE_EXERCISE_NOT_EXIST: { "isSuccess": false, "code": 709, "message":"운동 기록이 없습니다."},
    MYPAGE_EXERCISE_INVALID: { "isSuccess": false, "code": 710, "message":"운동 기록이 두 개 이상 존재합니다."},

    MYPAGE_CONTENT_EMPTY: { "isSuccess": false, "code": 711, "message":"내용이 존재하지 않습니다."},
    MYPAGE_FRIENDIDX_EMPTY: { "isSuccess": false, "code": 712, "message":"친구의 userId가 입력되지 않았습니다."},

    // process error
    INVALID_DAY_OF_WEEK: { "isSuccess": false, "code":801, "message":"요일을 입력해주세요."},
    PROCESS_TOTALTIME_INVALID: { "isSuccess": false, "code":802, "message":"운동 총 시간을 입력해주세요."},
    PROCESS_ROUTINECONTENT_INVALID: { "isSuccess": false, "code":803, "message":"routineDetails를 입력해주세요."},
    PROCESS_ORIGINROUTINEIDX_INVALID: { "isSuccess": false, "code":804, "message":"추천 받았던 routineIdx 값을 입력해주세요."},
    PROCESS_EXERCISE_NOT_EXIST: { "isSuccess":false, "code":805, "message":"운동 기록이 저장되지 않았습니다."},
    PROCESS_COMPARISON_NOT_EXIST: { "isSuccess":false, "code":806, "message":"비교할 직전 데이터가 존재하지 않습니다."},
    PROCESS_ORIGINROUTINEIDX_NOT_EXIST: { "isSuccess":false, "code":807, "message":"마이 캘린더에 추천받은 routineIdx가 존재하지 않습니다."},
    PROCESS_ROUTINEIDX_NOT_EXIST: { "isSuccess": false, "code": 808, "message":"해당 날짜에 routineIdx가 존재하지 않습니다."},
    PROCESS_CALORIES_NOT_EXIST: { "isSuccess": false, "code": 809, "message":"총 칼로리는 0보다 커야 합니다."},
    PROCESS_DAYOFWEEK_NOT_EXIST: { "isSuccess": false, "code": 810, "message":"해당 요일에 루틴이 존재하지 않습니다."},
    PROCESS_REPLACEMENT_NOT_EXIST: { "isSuccess": false, "code": 811, "message":"해당 운동과 관련된 다른 운동이 존재하지 않습니다."},
    
    // promotion error
    PROMOTION_EMAIL_NOT_EXIST: { "isSuccess": false, "code": 901, "message":"이메일을 입력해 주세요."},
    PROMOTION_PHONENUM_NOT_EXIST: { "isSuccess": false, "code": 902, "message":"전화번호를 입력해 주세요."},
    PROMOTION_ALREADY_ENTERED: { "isSuccess": false, "code": 903, "message":"이미 사전예약에 참여하셨습니다."},

    COUPON_CODE_EMPTY: { "isSuccess": false, "code": 910, "message":"쿠폰 코드를 입력해주세요."},
    COUPON_CODE_ERROR: { "isSuccess": false, "code": 911, "message":"유효하지 않은 쿠폰 코드입니다."},
    COUPON_CODE_USED: { "isSuccess": false, "code": 912, "message":"이미 사용한 코드입니다."},
    COUPON_CODE_EXPIRED: { "isSuccess": false, "code": 913, "message":"코드가 기간 만료되었습니다."},


    //Request error

    //signup(회원가입)
    SIGNUP_USERID_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_USERID_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_USERID_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    //signin(로그인)
    SIGNIN_USERID_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_USERID_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_USERID_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USER_USERID_EMPTY : { "isSuccess": false, "code": 2014, "message": "userId를 입력해주세요." },
    USER_USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    USER_USER_DEVTOKEN_EMPTY : { "isSuccess": false, "code": 2019, "message": "로그인한 기기의 디바이스토큰값을 입력해주세요." },
    // Response error
    SIGNUP_REDUNDANT_USERID : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_USERID_UNKNOWN : { "isSuccess": false, "code": 3003, "message": "존재하지 않는 이메일입니다." },
    SIGNIN_USERID_WRONG : { "isSuccess": false, "code": 3004, "message": "이메일이 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3005, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3007, "message": "탈퇴된 계정으로 30일 이내에 재가입 할 수 없습니다." },

    ROUTINE_UNDEFINED : { "isSuccess": false, "code": 3101, "message": "루틴이 존재하지 않습니다." },
    COMPARE_ROUTINE_UNDEFINED : { "isSuccess": false, "code": 3102, "message": "비교할 운동이 존재하지 않습니다."},

    HEALTHCATEGORYIDX_UNDEFINED : { "isSuccess": false, "code": 3201, "message": "운동이 존재하지 않습니다."},

    QUREY_PARAMETER_WRONG : { "isSuccess": false, "code": 3999, "message": "쿼리 파라미터가 잘못되었습니다." },
    
    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
    TRANSACTION_ERROR : { "isSuccess": false, "code": 4002, "message": "통신 오류"},
 
    //GPT Transaction 오류
    GPT_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
}