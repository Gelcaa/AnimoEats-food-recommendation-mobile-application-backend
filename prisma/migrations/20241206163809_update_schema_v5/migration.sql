/*
  Warnings:

  - You are about to drop the column `foodItemId` on the `user_food_choice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_foodItemId_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP COLUMN "foodItemId";
