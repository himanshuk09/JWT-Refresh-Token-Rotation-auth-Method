USE [Enexion_Global];
GO

CREATE TABLE [dbo].[Auth_RefreshToken]
(
    autoRefreshtokenid INT PRIMARY KEY IDENTITY(1,1),

    intUserId INT NOT NULL,

    vchTokenHash NVARCHAR(500) NOT NULL,

    datExpiresAt DATETIME2 NOT NULL,

    datSessionExpiresAt DATETIME2 NOT NULL,

    datCreatedAt DATETIME2 NOT NULL  
        CONSTRAINT DF_RefreshToken_CreatedAt DEFAULT SYSUTCDATETIME(),

    datUpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_Auth_RefreshToken_WD_User
        FOREIGN KEY (intUserId)
        REFERENCES [dbo].[WD_User](autUserId)
        ON DELETE CASCADE
);
GO