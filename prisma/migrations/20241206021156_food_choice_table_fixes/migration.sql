/*
  Warnings:

  - You are about to drop the column `foodIDetailsId` on the `user_food_choice` table. All the data in the column will be lost.
  - Added the required column `foodDetailsId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_foodIDetailsId_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP COLUMN "foodIDetailsId",
ADD COLUMN     "foodDetailsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_foodDetailsId_fkey" FOREIGN KEY ("foodDetailsId") REFERENCES "food"."food_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
