/*
  Warnings:

  - You are about to drop the column `summarize` on the `Application` table. All the data in the column will be lost.
  - Added the required column `summary` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "summarize",
ADD COLUMN     "sourceBoard" TEXT,
ADD COLUMN     "summary" TEXT NOT NULL,
ALTER COLUMN "companyEmail" DROP NOT NULL;
