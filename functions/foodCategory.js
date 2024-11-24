const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.createFoodCategory = async (event) => {
  const { categoryName } = JSON.parse(event.body);

  try {
    const category = await prisma.foodCategory.create({
      data: {
        name: categoryName,
      },
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Category '${categoryName}' created successfully!`,
        categoryId: category.id, 
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating category",
        error: error.message,
      }),
    };
  }
};
