/*
  Warnings:

  - Added the required column `rank` to the `user_category_rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user"."user_category_rating" ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 0;
