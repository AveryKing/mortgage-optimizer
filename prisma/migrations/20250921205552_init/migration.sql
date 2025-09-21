BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [emailVerified] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [refresh_token] NVARCHAR(1000),
    [access_token] NVARCHAR(1000),
    [expires_at] INT,
    [token_type] NVARCHAR(1000),
    [scope] NVARCHAR(1000),
    [id_token] NVARCHAR(1000),
    [session_state] NVARCHAR(1000),
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE NONCLUSTERED ([provider],[providerAccountId])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sessionToken] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Session_sessionToken_key] UNIQUE NONCLUSTERED ([sessionToken])
);

-- CreateTable
CREATE TABLE [dbo].[Loan] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [clientId] NVARCHAR(1000) NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [termYears] INT NOT NULL,
    [rate] FLOAT(53) NOT NULL,
    [creditScore] INT NOT NULL,
    [income] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Loan_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [optimized] BIT NOT NULL CONSTRAINT [Loan_optimized_df] DEFAULT 0,
    [recommendation] NVARCHAR(1000),
    CONSTRAINT [Loan_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Rate] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kind] NVARCHAR(1000) NOT NULL,
    [rate] FLOAT(53) NOT NULL,
    [source] NVARCHAR(1000) NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [Rate_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Rate_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ComplianceLog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [loanId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [details] NVARCHAR(1000) NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [ComplianceLog_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ComplianceLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[NotificationPreference] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [channel] NVARCHAR(1000) NOT NULL,
    [enabled] BIT NOT NULL CONSTRAINT [NotificationPreference_enabled_df] DEFAULT 1,
    CONSTRAINT [NotificationPreference_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Loan] ADD CONSTRAINT [Loan_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ComplianceLog] ADD CONSTRAINT [ComplianceLog_loanId_fkey] FOREIGN KEY ([loanId]) REFERENCES [dbo].[Loan]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NotificationPreference] ADD CONSTRAINT [NotificationPreference_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
