USE [Enexion_Global];
GO

CREATE PROCEDURE SP_Auth_DeleteActiveRefreshTokensByUserId
(
    @UserId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentUtc DATETIME2 = SYSUTCDATETIME();

    DELETE FROM [dbo].[Auth_RefreshToken]
    WHERE intUserId = @UserId
      AND datExpiresAt > @CurrentUtc
      AND datSessionExpiresAt > @CurrentUtc;
END
GO