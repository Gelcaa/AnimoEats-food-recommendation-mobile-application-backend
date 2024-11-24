const userHandler = require("../handlers/userHandler");

module.exports.loginUser = async (event) => {
  const body = JSON.parse(event.body);
  const response = await userHandler.loginUser(body);
  return response;
};

module.exports.registerUser = async (event) => {
  const body = JSON.parse(event.body);
  const response = await userHandler.registerUser(body);
  return response;
};

module.exports.updateUserTDEE = async (event) => {
  const body = JSON.parse(event.body);
  const response = await userHandler.updateUserTDEE(body);
  return response;
};

module.exports.updateUserHealthProfile = async (event) => {
  const body = JSON.parse(event.body);
  const response = await userHandler.updateUserHealthProfile(body);
  return response;
};

module.exports.updateAllergies = async (event) => {
  const body = JSON.parse(event.body);
  const response = await userHandler.updateAllergies(body);
  return response;
};

module.exports.completeRegistration = async (event) => {
  const body = JSON.parse(event.body);
  const response = await userHandler.completeRegistration(body);
  return response;
};

module.exports.getUserHealthProfile = async (event) => {
  const userId = parseInt(event.pathParameters.userId);
  const response = await userHandler.getUserHealthProfile(userId);
  return response;
};

module.exports.getUserAllergies = async (event) => {
  const userId = parseInt(event.pathParameters.userId);
  const response = await userHandler.getUserAllergies(userId);
  return response;
};

module.exports.getUserDetails = async (event) => {
  const userId = parseInt(event.pathParameters.userId);
  const response = await userHandler.getUserDetails(userId);
  return response;
};