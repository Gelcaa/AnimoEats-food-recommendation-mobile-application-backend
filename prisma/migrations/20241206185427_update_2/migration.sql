/*
  Warnings:

  - You are about to drop the column `user_id` on the `user_food_choice` table. All the data in the column will be lost.
  - Added the required column `userId` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_user_id_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
