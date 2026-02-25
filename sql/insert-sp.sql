USE [Enexion_Global];
GO

CREATE  PROCEDURE SP_Auth_InsertRefreshToken
(
    @intUserId INT,
    @vchTokenHash NVARCHAR(500),
    @datExpiresAt DATETIME2,
    @datSessionExpiresAt DATETIME2,
    @datCreatedAt DATETIME2,
    @datUpdatedAt DATETIME2
)
AS
DECLARE @output INT     
SET @output = -1         
BEGIN
    INSERT INTO [Enexion_Global].[dbo].[Auth_RefreshToken]
    (
       [intUserId]
      ,[vchTokenHash]
      ,[datExpiresAt]
      ,[datSessionExpiresAt]
      ,[datCreatedAt]
      ,[datUpdatedAt]
    )
    VALUES
    (
        @intUserId,
        @vchTokenHash,
        @datExpiresAt,
        @datSessionExpiresAt,
        @datCreatedAt,
        @datUpdatedAt
    )

	-- return last inserted identity value    
	SET @output = @@IDENTITY    
	-- return output parameter    
	RETURN @output 

END

GO