/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_user"."user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "app_user"."user_profile" (
    "user_profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tdee_id" INTEGER NOT NULL,
    "allergen_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("user_profile_id")
);

-- CreateTable
CREATE TABLE "app_user"."user_tdee" (
    "tdee_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tdee" DOUBLE PRECISION NOT NULL,
    "weight_kg" DOUBLE PRECISION NOT NULL,
    "height_feet" DOUBLE PRECISION NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tdee_pkey" PRIMARY KEY ("tdee_id")
);

-- CreateTable
CREATE TABLE "app_user"."user_allergies" (
    "allergen_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "egg_free" INTEGER NOT NULL,
    "gluten_free" INTEGER NOT NULL,
    "dairy_free" INTEGER NOT NULL,
    "fish_free" INTEGER NOT NULL,
    "shellfish_free" INTEGER NOT NULL,
    "peanut_free" INTEGER NOT NULL,
    "treenut_free" INTEGER NOT NULL,
    "soy_free" INTEGER NOT NULL,
    "wheat_free" INTEGER NOT NULL,

    CONSTRAINT "user_allergies_pkey" PRIMARY KEY ("allergen_id")
);
-- CreateIndex
CREATE UNIQUE INDEX "user_profile_user_id_key" ON "app_user"."user_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_tdee_id_key" ON "app_user"."user_profile"("tdee_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_allergen_id_key" ON "app_user"."user_profile"("allergen_id");

-- AddForeignKey
ALTER TABLE "app_user"."user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_profile" ADD CONSTRAINT "user_profile_tdee_id_fkey" FOREIGN KEY ("tdee_id") REFERENCES "app_user"."user_tdee"("tdee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_profile" ADD CONSTRAINT "user_profile_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "app_user"."user_allergies"("allergen_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_tdee" ADD CONSTRAINT "user_tdee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_allergies" ADD CONSTRAINT "user_allergies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
