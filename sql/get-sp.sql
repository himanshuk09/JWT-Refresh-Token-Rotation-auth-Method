USE [Enexion_Global];
GO

CREATE PROCEDURE SP_Auth_GetRefreshTokensByUserId
(
    @UserId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        autoRefreshtokenid,
        intUserId,
        vchTokenHash,
        datExpiresAt,
        datSessionExpiresAt,
        datCreatedAt,
        datUpdatedAt
    FROM [Enexion_Global].[dbo].[Auth_RefreshToken]
    WHERE intUserId = @UserId;
END
GO