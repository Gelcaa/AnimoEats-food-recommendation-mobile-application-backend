/*
  Warnings:

  - Added the required column `rank` to the `user_food_recommendations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user"."user_food_recommendations" ADD COLUMN     "rank" INTEGER NOT NULL;
