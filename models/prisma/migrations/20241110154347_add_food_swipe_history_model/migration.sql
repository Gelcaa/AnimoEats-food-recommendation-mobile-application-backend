-- CreateTable
CREATE TABLE "app_user"."food_swipe_history" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "foodItemId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "swipeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_swipe_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app_user"."food_swipe_history" ADD CONSTRAINT "food_swipe_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."food_swipe_history" ADD CONSTRAINT "food_swipe_history_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "food"."food_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."food_swipe_history" ADD CONSTRAINT "food_swipe_history_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
