-- DropForeignKey
ALTER TABLE "app_user"."user_profile" DROP CONSTRAINT "user_profile_allergen_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user"."user_profile" DROP CONSTRAINT "user_profile_tdee_id_fkey";

-- AlterTable
ALTER TABLE "app_user"."user_profile" ALTER COLUMN "tdee_id" DROP NOT NULL,
ALTER COLUMN "allergen_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "app_user"."user_profile" ADD CONSTRAINT "user_profile_tdee_id_fkey" FOREIGN KEY ("tdee_id") REFERENCES "app_user"."user_tdee"("tdee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user"."user_profile" ADD CONSTRAINT "user_profile_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "app_user"."user_allergies"("allergen_id") ON DELETE SET NULL ON UPDATE CASCADE;
