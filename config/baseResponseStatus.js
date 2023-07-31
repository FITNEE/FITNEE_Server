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

    USER_USER_USERID_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_USERID : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_USERID_UNKNOWN : { "isSuccess": false, "code": 3003, "message": "존재하지 않는 이메일입니다." },
    SIGNIN_USERID_WRONG : { "isSuccess": false, "code": 3004, "message": "이메일이 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3005, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3007, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    ROUTINE_UNDEFINED : { "isSuccess": false, "code": 3101, "message": "루틴이 존재하지 않습니다." },

    QUREY_PARAMETER_WRONG : { "isSuccess": false, "code": 3999, "message": "쿼리 파라미터가 잘못되었습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
    TRANSACTION_ERROR : { "isSuccess": false, "code": 4002, "message": "통신 오류"},
 
 
}
