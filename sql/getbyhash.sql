USE [Enexion_Global];
GO

ALTER PROCEDURE SP_Auth_GetRefreshTokenByHash
(
    @vchTokenHash NVARCHAR(500)
)
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
    WHERE vchTokenHash = @vchTokenHash
END
GO