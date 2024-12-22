const prisma = require("../prisma/prismaClient");
const dotenv = require("dotenv");
dotenv.config();

class FoodGateway {
  static async createFoodSwipeHistories({ userId, swipes }) {
    const K = 30; // Elo constant for rating adjustment
    const neutralBaseline = 1200; // Neutral baseline for expected score calculation

    console.log(
      `Starting createFoodSwipeHistories for userId: ${userId} with swipes:`,
      swipes
    );

    try {
      await prisma.$transaction(
        async (prisma) => {
          console.log(`Transaction started for userId: ${userId}`);

          // Step 1: Bulk create swipe histories
          const swipeHistoriesData = swipes.map((swipe) => ({
            userId,
            foodItemId: swipe.foodItemId,
            categoryId: swipe.categoryId,
            swipeDate: new Date(),
            createdAt: new Date(),
            preference: swipe.preference,
          }));

          const createdHistories = await prisma.foodSwipeHistory.createMany({
            data: swipeHistoriesData,
          });

          console.log(`Swipe histories created: ${createdHistories.count}`);

          // Step 2: Fetch all relevant userCategoryRatings upfront
          const categoryIds = swipes.map((swipe) => swipe.categoryId);
          const uniqueCategoryIds = [...new Set(categoryIds)];

          const existingRatings = await prisma.userCategoryRating.findMany({
            where: {
              userId,
              categoryId: { in: uniqueCategoryIds },
            },
          });

          const ratingsMap = new Map();
          existingRatings.forEach((rating) => {
            ratingsMap.set(rating.categoryId, rating);
          });

          // Step 3: Prepare bulk upsert data for userCategoryRatings
          const userCategoryRatingUpdates = [];
          const userCategoryRatingCreates = [];

          swipes.forEach((swipe) => {
            const { categoryId, preference } = swipe;
            const existingRating = ratingsMap.get(categoryId);

            const S = preference === "like" ? 1 : 0;
            let newRating;

            if (existingRating) {
              const R = existingRating.rating;
              const E = 1 / (1 + Math.pow(10, (neutralBaseline - R) / 400));
              newRating = R + K * (S - E);

              userCategoryRatingUpdates.push({
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
            } else {
              const neutralRating = neutralBaseline;
              const E =
                1 / (1 + Math.pow(10, (neutralBaseline - neutralRating) / 400));
              newRating = neutralRating + K * (S - E);

              userCategoryRatingCreates.push({
                userId,
                categoryId,
                rating: newRating,
                rank: 0, // Placeholder, will update ranks later
              });

              // Add to map for consistency if multiple swipes affect the same category
              ratingsMap.set(categoryId, { categoryId, rating: newRating });
            }

            // Update the map with the new rating
            if (existingRating) {
              ratingsMap.set(categoryId, { categoryId, rating: newRating });
            }
          });

          // Execute bulk updates
          if (userCategoryRatingUpdates.length > 0) {
            const updatePromises = userCategoryRatingUpdates.map((update) =>
              prisma.userCategoryRating.update(update)
            );
            await Promise.all(updatePromises);
            console.log(
              `Updated ${userCategoryRatingUpdates.length} userCategoryRatings`
            );
          }

          // Execute bulk creates
          if (userCategoryRatingCreates.length > 0) {
            await prisma.userCategoryRating.createMany({
              data: userCategoryRatingCreates,
              skipDuplicates: true, // In case of concurrent operations
            });
            console.log(
              `Created ${userCategoryRatingCreates.length} userCategoryRatings`
            );
          }

          // Step 4: Fetch all userCategoryRatings after updates
          const updatedUserCategories =
            await prisma.userCategoryRating.findMany({
              where: { userId },
            });

          console.log(
            `Fetched user categories for ranking:`,
            updatedUserCategories
          );

          // Step 5: Sort categories by their Elo ratings in descending order
          const sortedCategories = updatedUserCategories.sort(
            (a, b) => b.rating - a.rating
          );

          console.log(`Sorted categories by rating:`, sortedCategories);

          // Step 6: Calculate ranks in memory
          let rank = 14; // Start ranking from Rank 14 (highest rating)
          let previousRating = null;
          let previousRank = rank;
          const rankUpdates = [];

          sortedCategories.forEach((category, index) => {
            if (category.rating === previousRating) {
              // Assign the same rank as the previous category
              rankUpdates.push({
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
              rankUpdates.push({
                where: {
                  userId_categoryId: {
                    userId,
                    categoryId: category.categoryId,
                  },
                },
                data: {
                  rank: rank,
                },
              });

              // Update previousRank and decrease rank for next category
              previousRank = rank;
              rank--;
            }
            previousRating = category.rating;
          });

          // Execute bulk rank updates
          if (rankUpdates.length > 0) {
            const updateRankPromises = rankUpdates.map((update) =>
              prisma.userCategoryRating.update(update)
            );
            await Promise.all(updateRankPromises);
            console.log(`Updated ranks for ${rankUpdates.length} categories`);
          }

          console.log(
            `Transaction completed successfully for userId: ${userId}`
          );
        },
        {
          timeout: 40000, // Specify timeout in milliseconds
        }
      );
    } catch (error) {
      console.error(
        `Error during createFoodSwipeHistories for userId: ${userId}`,
        error
      );
      throw error;
    }
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

  static async createFoodChoiceInDb(data) {
    const { userId, foodItemId, categoryId } = data;
    const K = 30;
    const neutralBaseline = 1200;
    // Use the adjusted time (Philippine Time) as choiceDate
    let date = new Date();

    // Adjust the current date to Philippine Time (UTC + 8)
    let philippinesTime = new Date(date.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours in milliseconds

    // Store the adjusted time in ISO format
    const choiceDate = philippinesTime.toISOString();
    // Insert the food choice into the database

    try {
      // Start a transaction to group all related operations
      const foodChoiceHistory = await prisma.$transaction(
        async (tx) => {
          // Insert the food choice into the database
          const foodChoice = await tx.userFoodChoice.create({
            data: {
              userId,
              foodItemId,
              categoryId,
              choiceDate,
            },
          });

          // Fetch the user-category rating
          let userCategoryRating = await tx.userCategoryRating.findUnique({
            where: {
              userId_categoryId: {
                userId,
                categoryId,
              },
            },
          });

          if (!userCategoryRating) {
            // Create the user-category rating if it doesn't exist
            userCategoryRating = await tx.userCategoryRating.create({
              data: {
                userId,
                categoryId,
                rating: neutralBaseline, // Starting Elo rating
                rank: 0, // Temporary rank; will be updated later
              },
            });
          } else {
            const R = userCategoryRating.rating;

            // Elo calculation for updated rating
            const E = 1 / (1 + Math.pow(10, (neutralBaseline - R) / 400));
            const S = 1; // Assuming a win; adjust accordingly if different
            const newRating = R + K * (S - E);

            // Update the rating
            await tx.userCategoryRating.update({
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

          // Recalculate ranks for all categories of the user
          // Fetch all user categories with updated ratings
          const userCategories = await tx.userCategoryRating.findMany({
            where: { userId },
            orderBy: { rating: "desc" },
          });

          // Assign ranks based on sorted ratings
          let rank = 14;
          let previousRating = null;
          let previousRank = rank;

          // Prepare bulk update data
          const rankUpdates = userCategories.map((category, index) => {
            if (category.rating === previousRating) {
              // Same rank as previous if ratings are equal
              return {
                where: {
                  userId_categoryId: {
                    userId,
                    categoryId: category.categoryId,
                  },
                },
                data: {
                  rank: previousRank,
                },
              };
            } else {
              // Assign current rank
              previousRank = rank;
              previousRating = category.rating;
              rank--;
              return {
                where: {
                  userId_categoryId: {
                    userId,
                    categoryId: category.categoryId,
                  },
                },
                data: {
                  rank: previousRank,
                },
              };
            }
          });

          // Execute all rank updates in parallel
          await Promise.all(
            rankUpdates.map((update) => tx.userCategoryRating.update(update))
          );

          return foodChoice;
        },
        { timeout: 40000 }
      );

      console.log("Food choice history created:", foodChoiceHistory);
      return foodChoiceHistory;
    } catch (error) {
      console.error(
        `Error during createFoodChoiceInDb for userId: ${userId}`,
        error
      );
      throw error;
    }
  }
}

module.exports = FoodGateway;
