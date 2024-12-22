/*
  Warnings:

  - The primary key for the `user_food_choice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `choice_date` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `food_item_id` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `user_food_choice_id` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_food_choice` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodItemId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_category_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_food_item_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_user_id_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_pkey",
DROP COLUMN "category_id",
DROP COLUMN "choice_date",
DROP COLUMN "food_item_id",
DROP COLUMN "user_food_choice_id",
DROP COLUMN "user_id",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "choiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "foodItemId" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "user_food_choice_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
