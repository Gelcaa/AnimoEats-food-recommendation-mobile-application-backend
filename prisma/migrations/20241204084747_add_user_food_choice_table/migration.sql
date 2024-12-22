-- CreateTable
CREATE TABLE "app_user"."user_food_choice" (
    "user_food_choice_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "food_item_id" INTEGER NOT NULL,
    "choice_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "user_food_choice_pkey" PRIMARY KEY ("user_food_choice_id")
);

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_choice" ADD CONSTRAINT "user_food_choice_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
