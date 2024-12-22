-- CreateTable
CREATE TABLE "app_user"."user_category_rating" (
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_category_rating_pkey" PRIMARY KEY ("userId","categoryId")
);

-- AddForeignKey
ALTER TABLE "app_user"."user_category_rating" ADD CONSTRAINT "user_category_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_category_rating" ADD CONSTRAINT "user_category_rating_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
