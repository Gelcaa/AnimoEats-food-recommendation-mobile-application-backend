function successResponse(statusCode, data) {
  return {
    statusCode,
    body: JSON.stringify({ success: true, data }),
  };
}

function errorResponse(statusCode, message) {
  return {
    statusCode,
    body: JSON.stringify({ success: false, error: message }),
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
