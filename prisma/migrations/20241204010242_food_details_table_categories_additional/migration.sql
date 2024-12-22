-- CreateTable
CREATE TABLE "food"."food_details" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "foodName" TEXT NOT NULL,
    "stallName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbohydrates" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "sugar" DOUBLE PRECISION NOT NULL,
    "sodium" DOUBLE PRECISION NOT NULL,
    "eggFree" BOOLEAN NOT NULL DEFAULT false,
    "glutenFree" BOOLEAN NOT NULL DEFAULT false,
    "dairyFree" BOOLEAN NOT NULL DEFAULT false,
    "fishFree" BOOLEAN NOT NULL DEFAULT false,
    "shellfishFree" BOOLEAN NOT NULL DEFAULT false,
    "peanutFree" BOOLEAN NOT NULL DEFAULT false,
    "treenutFree" BOOLEAN NOT NULL DEFAULT false,
    "soyFree" BOOLEAN NOT NULL DEFAULT false,
    "wheatFree" BOOLEAN NOT NULL DEFAULT false,
    "categorySalad" INTEGER NOT NULL,
    "categoryAppetizers" INTEGER NOT NULL,
    "categoryBeef" INTEGER NOT NULL,
    "categoryBreakfast" INTEGER NOT NULL,
    "categoryChicken" INTEGER NOT NULL,
    "categoryMixed" INTEGER NOT NULL,
    "categoryNoodle" INTEGER NOT NULL,
    "categoryPasta" INTEGER NOT NULL,
    "categoryPizza" INTEGER NOT NULL,
    "categoryPork" INTEGER NOT NULL,
    "categorySandwiches" INTEGER NOT NULL,
    "categorySeafood" INTEGER NOT NULL,
    "categorySidedish" INTEGER NOT NULL,
    "categoryVegetable" INTEGER NOT NULL,

    CONSTRAINT "food_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "food"."food_details" ADD CONSTRAINT "food_details_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food"."food_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
