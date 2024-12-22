/*
  Warnings:

  - You are about to drop the `food_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_user"."food_swipe_history" DROP CONSTRAINT "food_swipe_history_foodItemId_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_foodItemId_fkey";

-- DropForeignKey
ALTER TABLE "food"."food_items" DROP CONSTRAINT "food_items_categoryId_fkey";

-- DropTable
DROP TABLE "food"."food_items";

-- CreateTable
CREATE TABLE "food"."food_item" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "url" TEXT,
    "name" TEXT NOT NULL,
    "stallName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbohydrates" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "sugar" DOUBLE PRECISION NOT NULL,
    "sodium" DOUBLE PRECISION NOT NULL,
    "eggFree" BOOLEAN NOT NULL DEFAULT false,
    "glutenFree" BOOLEAN NOT NULL DEFAULT false,
    "dairyFree" BOOLEAN NOT NULL DEFAULT false,
    "fishFree" BOOLEAN NOT NULL DEFAULT false,
    "shellfishFree" BOOLEAN NOT NULL DEFAULT false,
    "peanutFree" BOOLEAN NOT NULL DEFAULT false,
    "treenutFree" BOOLEAN NOT NULL DEFAULT false,
    "soyFree" BOOLEAN NOT NULL DEFAULT false,
    "wheatFree" BOOLEAN NOT NULL DEFAULT false,
    "categorySalad" INTEGER NOT NULL,
    "categoryAppetizers" INTEGER NOT NULL,
    "categoryBeef" INTEGER NOT NULL,
    "categoryBreakfast" INTEGER NOT NULL,
    "categoryChicken" INTEGER NOT NULL,
    "categoryMixed" INTEGER NOT NULL,
    "categoryNoodle" INTEGER NOT NULL,
    "categoryPasta" INTEGER NOT NULL,
    "categoryPizza" INTEGER NOT NULL,
    "categoryPork" INTEGER NOT NULL,
    "categorySandwiches" INTEGER NOT NULL,
    "categorySeafood" INTEGER NOT NULL,
    "categorySidedish" INTEGER NOT NULL,
    "categoryVegetable" INTEGER NOT NULL,

    CONSTRAINT "food_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app_user"."food_swipe_history" ADD CONSTRAINT "food_swipe_history_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food"."food_item" ADD CONSTRAINT "food_item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
