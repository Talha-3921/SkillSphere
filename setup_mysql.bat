@echo off
echo Setting up MySQL for SkillSphere...
echo.

cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"

echo Initializing MySQL data directory (no root password)...
mysqld --initialize-insecure

echo.
echo Starting MySQL service...
net start MySQL84

echo.
echo Creating SkillSphere database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS skillsphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -e "SHOW DATABASES;"

echo.
echo MySQL setup complete!
echo Database 'skillsphere_db' created successfully.
echo.
pause
