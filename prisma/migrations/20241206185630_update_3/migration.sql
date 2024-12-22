/*
  Warnings:

  - You are about to drop the column `category_id` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `choice_date` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `food_item_id` on the `user_food_choice` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodItemId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_category_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_food_item_id_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP COLUMN "category_id",
DROP COLUMN "choice_date",
DROP COLUMN "food_item_id",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "choiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "foodItemId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "food"."food_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
