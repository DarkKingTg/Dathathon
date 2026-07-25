@echo off
echo Starting KSP-Chanakya Backend API Server...
echo.
echo Setting environment variables...
set PORT=5000
set NODE_ENV=development

echo.
echo Building and starting server on port 5000...
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
