/*
  Warnings:

  - The primary key for the `user_food_choice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_food_choice_id` on the `user_food_choice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_pkey",
DROP COLUMN "user_food_choice_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_food_choice_pkey" PRIMARY KEY ("id");
