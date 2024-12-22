-- CreateTable
CREATE TABLE "app_user"."user_food_recommendations" (
    "user_food_recommendation_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "food_detail_id" INTEGER NOT NULL,
    "recommended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_food_recommendations_pkey" PRIMARY KEY ("user_food_recommendation_id")
);

-- AddForeignKey
ALTER TABLE "app_user"."user_food_recommendations" ADD CONSTRAINT "user_food_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_food_recommendations" ADD CONSTRAINT "user_food_recommendations_food_detail_id_fkey" FOREIGN KEY ("food_detail_id") REFERENCES "food"."food_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
