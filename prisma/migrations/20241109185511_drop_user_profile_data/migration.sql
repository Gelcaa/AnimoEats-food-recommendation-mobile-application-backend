/*
  Warnings:

  - You are about to drop the `user_profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_profile" DROP CONSTRAINT "user_profile_allergen_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_profile" DROP CONSTRAINT "user_profile_health_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_profile" DROP CONSTRAINT "user_profile_user_id_fkey";

-- DropTable
DROP TABLE "app_user"."user_profile";
