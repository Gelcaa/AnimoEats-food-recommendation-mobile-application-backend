const foodHandler = require("../handlers/foodHandler");

module.exports.handleGetAvailableFoodItems = async (event) => {
  const userId = parseInt(event.pathParameters.userId); // Get the userId from the event path
  const response = await foodHandler.getAvailableFoodItems(userId);
  return response;
};

module.exports.handleCreateFoodSwipeHistory = async (event) => {
  const { userId, swipes } = JSON.parse(event.body);
  const response = await foodHandler.createFoodSwipeHistories({ userId, swipes });
  return response;
};
