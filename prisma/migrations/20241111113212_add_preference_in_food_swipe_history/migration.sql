/*
  Warnings:

  - Added the required column `preference` to the `food_swipe_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user"."food_swipe_history" ADD COLUMN     "preference" TEXT NOT NULL;
