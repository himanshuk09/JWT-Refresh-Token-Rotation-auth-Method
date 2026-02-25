USE [Enexion_Global];
GO
-- CREATE PROCEDURE SP_Auth_DeleteRefreshTokens
-- (
--     @TokenId INT
-- )
-- AS
-- BEGIN
--     SET NOCOUNT ON;

--     DELETE FROM [dbo].[Auth_RefreshToken]
--     WHERE autoRefreshtokenid = @TokenId;
-- END
-- GO


ALTER PROCEDURE SP_Auth_DeleteRefreshTokens
(
    @TokenId INT
)
AS
BEGIN
    SET NOCOUNT ON;

   DECLARE @CurrentUtc DATETIME2 = SYSUTCDATETIME();

   DELETE FROM [dbo].[Auth_RefreshToken]
   WHERE 
        autoRefreshtokenid = @TokenId
        OR 
        (
            datSessionExpiresAt <= @CurrentUtc
            OR datExpiresAt <= @CurrentUtc
        );

    RETURN @@ROWCOUNT;
END
