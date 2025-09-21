/*
  Warnings:

  - You are about to alter the column `access_token` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Account] ALTER COLUMN [access_token] VARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
