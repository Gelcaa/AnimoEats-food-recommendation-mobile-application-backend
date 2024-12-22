/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user_auth_code` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_auth_code_email_key" ON "app_user"."user_auth_code"("email");
