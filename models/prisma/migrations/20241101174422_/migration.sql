/*
  Warnings:

  - Made the column `bmi` on table `user_health_profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `calories` on table `user_health_profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weightGoal` on table `user_health_profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "app_user"."user_health_profile" ALTER COLUMN "bmi" SET NOT NULL,
ALTER COLUMN "bmi" DROP DEFAULT,
ALTER COLUMN "calories" SET NOT NULL,
ALTER COLUMN "calories" DROP DEFAULT,
ALTER COLUMN "weightGoal" SET NOT NULL,
ALTER COLUMN "weightGoal" DROP DEFAULT,
ALTER COLUMN "weightGoal" SET DATA TYPE TEXT;
