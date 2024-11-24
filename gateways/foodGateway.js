const prisma = require("../models/prisma/prismaClient");

class FoodGateway {
  static async createFoodSwipeHistories({ userId, swipes }) {
    const K = 30; // Elo constant for rating adjustment
    const neutralBaseline = 1200; // Neutral baseline for expected score calculation

    // Start a transaction to handle creating swipes and updating ratings atomically
    await prisma.$transaction(async (prisma) => {
      // Step 1: Update Elo ratings for each swipe
      for (const swipe of swipes) {
        const { foodItemId, categoryId, preference } = swipe;

        // Record the swipe in the history
        await prisma.foodSwipeHistory.create({
          data: {
            userId,
            foodItemId,
            categoryId,
            swipeDate: new Date(),
            createdAt: new Date(),
            preference,
          },
        });

        // Fetch or initialize the user-category rating
        let userCategoryRating = await prisma.userCategoryRating.upsert({
          where: {
            userId_categoryId: {
              userId,
              categoryId,
            },
          },
          update: {},
          create: {
            userId,
            categoryId,
            rating: neutralBaseline, // Starting Elo rating
            rank: 0, // Rank will be updated later
          },
        });

        const R = userCategoryRating.rating;

        // Calculate the expected score (E) using Elo formula
        const E = 1 / (1 + Math.pow(10, (neutralBaseline - R) / 400));

        // Score (S) is 1 for "like" and 0 for "dislike"
        const S = preference === "like" ? 1 : 0;

        // Apply the Elo formula to get the new rating
        const newRating = R + K * (S - E);

        // Update the user's rating for the category
        await prisma.userCategoryRating.update({
          where: {
            userId_categoryId: {
              userId,
              categoryId,
            },
          },
          data: {
            rating: newRating,
          },
        });
      }

      // Step 2: Calculate ranks for the user's food categories after Elo ratings are updated
      const userCategories = await prisma.userCategoryRating.findMany({
        where: { userId },
      });

      // Step 3: Sort categories by their Elo ratings in descending order
      const sortedCategories = userCategories.sort(
        (a, b) => b.rating - a.rating
      );

      // Step 4: Assign ranks to the user's food categories, based on sorted Elo ratings
      let rank = 14; // Start ranking from Rank 14 (highest rating)
      let previousRating = null; // Track the previous category's rating
      let previousRank = rank; // Track the rank assigned to the previous rating

      for (let i = 0; i < sortedCategories.length; i++) {
        const category = sortedCategories[i];

        if (category.rating === previousRating) {
          // Assign the same rank as the previous category
          await prisma.userCategoryRating.update({
            where: {
              userId_categoryId: {
                userId,
                categoryId: category.categoryId,
              },
            },
            data: {
              rank: previousRank,
            },
          });
        } else {
          // Assign the current rank for a new rating
          await prisma.userCategoryRating.update({
            where: {
              userId_categoryId: {
                userId,
                categoryId: category.categoryId,
              },
            },
            data: {
              rank,
            },
          });

          // Update previousRank to current rank and decrease rank for the next category
          previousRank = rank;
          rank--;
        }

        // Update the previous rating for comparison
        previousRating = category.rating;
      }
    });
  }

  // Fetch available food items for a user across categories
  static async getAvailableFoodItems(userId) {
    const categories = await prisma.foodCategory.findMany();
    const foodItems = await Promise.all(
      categories.map(async (category) => {
        const allFoodItems = await prisma.foodItem.findMany({
          where: {
            categoryId: category.id,
          },
        });

        const swipedFoodItems = await prisma.foodSwipeHistory.findMany({
          where: {
            userId,
            categoryId: category.id,
          },
        });

        const lastSwipedFoodItem =
          swipedFoodItems.length > 0
            ? swipedFoodItems[swipedFoodItems.length - 1]
            : null;

        let nextFoodItem;
        if (lastSwipedFoodItem) {
          const lastIndex = allFoodItems.findIndex(
            (item) => item.id === lastSwipedFoodItem.foodItemId
          );
          nextFoodItem = allFoodItems[(lastIndex + 1) % allFoodItems.length];
        } else {
          nextFoodItem = allFoodItems[0];
        }

        return {
          categoryId: category.id,
          categoryName: category.name,
          foodItem: nextFoodItem,
        };
      })
    );

    return foodItems;
  }
}

module.exports = FoodGateway;
