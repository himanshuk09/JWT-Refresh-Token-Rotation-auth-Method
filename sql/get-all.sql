USE [Enexion_Global];
GO

Create PROCEDURE SP_Auth_GetAllRefreshToken
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        autoRefreshtokenid AS TokenID,
        intUserId AS UserID,
        vchTokenHash AS TokenHash,
        datExpiresAt AS ExpiresAt,
        datSessionExpiresAt AS SessionExpiresAt,
        datCreatedAt AS CreatedAt,
        datUpdatedAt AS UpdatedAt
    FROM [Enexion_Global].[dbo].[Auth_RefreshToken]
END
GO