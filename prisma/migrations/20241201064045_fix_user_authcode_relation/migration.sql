-- CreateTable
CREATE TABLE "app_user"."user_auth_code" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_auth_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_code_email_key" ON "app_user"."user_auth_code"("email");

-- AddForeignKey
ALTER TABLE "app_user"."user_auth_code" ADD CONSTRAINT "user_auth_code_email_fkey" FOREIGN KEY ("email") REFERENCES "app_user"."user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
