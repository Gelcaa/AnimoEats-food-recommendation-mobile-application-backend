/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_allergies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_allergies_user_id_key" ON "app_user"."user_allergies"("user_id");
