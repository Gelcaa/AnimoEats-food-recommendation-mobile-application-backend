/*
  Warnings:

  - You are about to drop the column `tdee` on the `user_health_profile` table. All the data in the column will be lost.
  - Added the required column `bmi` to the `user_health_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `user_health_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightGoal` to the `user_health_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user"."user_health_profile" DROP COLUMN "tdee",
ADD COLUMN "bmi" FLOAT DEFAULT 0,
ADD COLUMN "calories" FLOAT DEFAULT 2000, 
ADD COLUMN "weightGoal" VARCHAR(255) DEFAULT 'maintain';
