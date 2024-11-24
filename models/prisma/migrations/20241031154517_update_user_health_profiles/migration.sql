/*
  Warnings:

  - You are about to drop the column `tdee_id` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the `user_tdee` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[health_profile_id]` on the table `user_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "app_user"."user_profile" DROP CONSTRAINT "user_profile_tdee_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_tdee" DROP CONSTRAINT "user_tdee_user_id_fkey";

-- DropIndex
DROP INDEX "app_user"."user_profile_tdee_id_key";

-- AlterTable
ALTER TABLE "app_user"."user_profile" DROP COLUMN "tdee_id",
ADD COLUMN     "health_profile_id" INTEGER;

-- DropTable
DROP TABLE "app_user"."user_tdee";

-- CreateTable
CREATE TABLE "app_user"."user_health_profile" (
    "health_profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tdee" DOUBLE PRECISION NOT NULL,
    "weight_kg" DOUBLE PRECISION NOT NULL,
    "height_feet" DOUBLE PRECISION NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "carbohydrate" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "sodium" DOUBLE PRECISION NOT NULL,
    "sugar" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_health_profile_pkey" PRIMARY KEY ("health_profile_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_health_profile_user_id_key" ON "app_user"."user_health_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_health_profile_id_key" ON "app_user"."user_profile"("health_profile_id");

-- AddForeignKey
ALTER TABLE "app_user"."user_profile" ADD CONSTRAINT "user_profile_health_profile_id_fkey" FOREIGN KEY ("health_profile_id") REFERENCES "app_user"."user_health_profile"("health_profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_health_profile" ADD CONSTRAINT "user_health_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
