/*
  Warnings:

  - Made the column `url` on table `food_item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "food"."food_item" ALTER COLUMN "url" SET NOT NULL;
