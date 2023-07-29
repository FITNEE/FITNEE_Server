const response = ({isSuccess, code, message}, result) => {
   return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
   }
  };

  const errResponse = ({code, message}) => {
    return {
        isSuccess: false,
        code: code,
        message: message
      }
  };
  
  module.exports = { response, errResponse };