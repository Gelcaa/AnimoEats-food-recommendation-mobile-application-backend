/*
  Warnings:

  - The primary key for the `user_food_choice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `choiceDate` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `foodDetailsId` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `user_food_choice` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_food_choice` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `food_item_id` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_food_choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_foodDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_userId_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "choiceDate",
DROP COLUMN "foodDetailsId",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "choice_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "food_item_id" INTEGER NOT NULL,
ADD COLUMN     "user_food_choice_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_food_choice_pkey" PRIMARY KEY ("user_food_choice_id");

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
