/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_tdee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "app_user"."user_allergies" ALTER COLUMN "egg_free" SET DEFAULT 0,
ALTER COLUMN "gluten_free" SET DEFAULT 0,
ALTER COLUMN "dairy_free" SET DEFAULT 0,
ALTER COLUMN "fish_free" SET DEFAULT 0,
ALTER COLUMN "shellfish_free" SET DEFAULT 0,
ALTER COLUMN "peanut_free" SET DEFAULT 0,
ALTER COLUMN "treenut_free" SET DEFAULT 0,
ALTER COLUMN "soy_free" SET DEFAULT 0,
ALTER COLUMN "wheat_free" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "user_tdee_user_id_key" ON "app_user"."user_tdee"("user_id");
