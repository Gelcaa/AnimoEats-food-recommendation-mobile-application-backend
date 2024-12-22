/*
  Warnings:

  - You are about to drop the column `food_item_id` on the `user_food_choice` table. All the data in the column will be lost.
  - Added the required column `food_details_id` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_food_item_id_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP COLUMN "food_item_id",
ADD COLUMN     "food_details_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_food_details_id_fkey" FOREIGN KEY ("food_details_id") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
