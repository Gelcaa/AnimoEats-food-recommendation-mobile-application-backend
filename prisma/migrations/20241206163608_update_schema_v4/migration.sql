-- DropForeignKey
ALTER TABLE "app_user"."user_food_choice" DROP CONSTRAINT "user_food_choice_food_details_id_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_food_choice" ADD COLUMN     "foodItemId" INTEGER;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_food_details_id_fkey" FOREIGN KEY ("food_details_id") REFERENCES "food"."food_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "food"."food_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
