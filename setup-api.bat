@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo   🎬 Sora-2 AI 视频生成器 - API 配置向导
echo ==========================================
echo.

REM 检查 .env.local 是否存在
if not exist .env.local (
    echo ❌ 错误：找不到 .env.local 文件
    echo 正在从 env.example 创建...
    copy env.example .env.local >nul
    echo ✅ .env.local 文件已创建
    echo.
)

echo 请选择您要配置的 API 服务：
echo.
echo 1^) Replicate API（推荐，每月免费 $5，质量最佳）
echo 2^) Hugging Face API（完全免费，有速率限制）
echo 3^) 同时配置两个（推荐）
echo 4^) 查看当前配置
echo 5^) 手动编辑配置文件
echo 6^) 退出
echo.
set /p choice="请输入选项 (1-6): "

if "%choice%"=="1" goto replicate
if "%choice%"=="2" goto huggingface
if "%choice%"=="3" goto both
if "%choice%"=="4" goto status
if "%choice%"=="5" goto manual
if "%choice%"=="6" goto end

echo ❌ 无效的选项
goto end

:replicate
echo.
echo ==========================================
echo   配置 Replicate API
echo ==========================================
echo.
echo 📝 步骤：
echo 1. 在浏览器打开：https://replicate.com/
echo 2. 注册账号（可使用 GitHub 登录）
echo 3. 访问：https://replicate.com/account/api-tokens
echo 4. 点击 'Create token'
echo 5. 复制生成的 Token（格式：r8_xxxxx...）
echo.
set /p replicate_token="请粘贴您的 Replicate Token: "

REM 检查 token 格式
echo !replicate_token! | findstr /b "r8_" >nul
if errorlevel 1 (
    echo.
    echo ❌ Token 格式不正确（应该以 r8_ 开头）
    echo 请重新运行脚本并检查 Token
    pause
    goto end
)

REM 替换配置文件中的 token
powershell -Command "(Get-Content .env.local) -replace 'REPLICATE_API_TOKEN=\"r8_.*\"', 'REPLICATE_API_TOKEN=\"!replicate_token!\"' | Set-Content .env.local"
echo.
echo ✅ Replicate API Token 配置成功！
goto complete

:huggingface
echo.
echo ==========================================
echo   配置 Hugging Face API
echo ==========================================
echo.
echo 📝 步骤：
echo 1. 在浏览器打开：https://huggingface.co/
echo 2. 注册账号
echo 3. 访问：https://huggingface.co/settings/tokens
echo 4. 点击 'New token'
echo 5. 权限选择 'Read'
echo 6. 复制生成的 Token（格式：hf_xxxxx...）
echo.
set /p hf_token="请粘贴您的 Hugging Face Token: "

REM 检查 token 格式
echo !hf_token! | findstr /b "hf_" >nul
if errorlevel 1 (
    echo.
    echo ❌ Token 格式不正确（应该以 hf_ 开头）
    echo 请重新运行脚本并检查 Token
    pause
    goto end
)

REM 替换配置文件中的 token
powershell -Command "(Get-Content .env.local) -replace 'HF_API_TOKEN=\"hf_.*\"', 'HF_API_TOKEN=\"!hf_token!\"' | Set-Content .env.local"
echo.
echo ✅ Hugging Face API Token 配置成功！
goto complete

:both
echo.
echo ==========================================
echo   同时配置两个 API（推荐）
echo ==========================================
echo.

REM Replicate
echo --- Replicate API ---
echo 访问：https://replicate.com/account/api-tokens
set /p replicate_token="请粘贴您的 Replicate Token: "

echo.
REM Hugging Face
echo --- Hugging Face API ---
echo 访问：https://huggingface.co/settings/tokens
set /p hf_token="请粘贴您的 Hugging Face Token: "

echo.

REM 配置 Replicate
echo !replicate_token! | findstr /b "r8_" >nul
if not errorlevel 1 (
    powershell -Command "(Get-Content .env.local) -replace 'REPLICATE_API_TOKEN=\"r8_.*\"', 'REPLICATE_API_TOKEN=\"!replicate_token!\"' | Set-Content .env.local"
    echo ✅ Replicate 配置成功
) else (
    echo ⚠️ Replicate Token 格式不正确，已跳过
)

REM 配置 Hugging Face
echo !hf_token! | findstr /b "hf_" >nul
if not errorlevel 1 (
    powershell -Command "(Get-Content .env.local) -replace 'HF_API_TOKEN=\"hf_.*\"', 'HF_API_TOKEN=\"!hf_token!\"' | Set-Content .env.local"
    echo ✅ Hugging Face 配置成功
) else (
    echo ⚠️ Hugging Face Token 格式不正确，已跳过
)

goto complete

:status
echo.
echo ==========================================
echo   当前配置状态
echo ==========================================
echo.

REM 读取配置
for /f "tokens=2 delims==" %%a in ('findstr "REPLICATE_API_TOKEN=" .env.local') do set replicate=%%a
for /f "tokens=2 delims==" %%a in ('findstr "HF_API_TOKEN=" .env.local') do set hf=%%a

REM 去除引号
set replicate=!replicate:"=!
set hf=!hf:"=!

REM 检查 Replicate
echo !replicate! | findstr /b "r8_" >nul
if not errorlevel 1 (
    if not "!replicate!"=="r8_..." (
        echo ✅ Replicate API: 已配置
        echo    Token: !replicate:~0,15!...!replicate:~-5!
    ) else (
        echo ❌ Replicate API: 未配置
    )
) else (
    echo ❌ Replicate API: 未配置
)

echo.

REM 检查 Hugging Face
echo !hf! | findstr /b "hf_" >nul
if not errorlevel 1 (
    if not "!hf!"=="hf_..." (
        echo ✅ Hugging Face API: 已配置
        echo    Token: !hf:~0,15!...!hf:~-5!
    ) else (
        echo ❌ Hugging Face API: 未配置
    )
) else (
    echo ❌ Hugging Face API: 未配置
)

echo.
pause
goto end

:manual
echo.
echo ==========================================
echo   手动编辑配置文件
echo ==========================================
echo.
echo 正在使用记事本打开 .env.local 文件...
echo.
echo 📝 手动配置步骤：
echo 1. 找到以下两行：
echo    REPLICATE_API_TOKEN="r8_..."
echo    HF_API_TOKEN="hf_..."
echo.
echo 2. 将 "r8_..." 或 "hf_..." 替换为您的真实 Token
echo    例如：REPLICATE_API_TOKEN="r8_BpLkzf9QX..."
echo.
echo 3. 保存文件（Ctrl+S）并关闭记事本
echo.
notepad .env.local
echo.
echo ✅ 配置文件已打开
echo    请确保已保存修改
echo.
pause
goto end

:complete
echo.
echo ==========================================
echo   🎉 配置完成！
echo ==========================================
echo.
echo ⚠️  重要提醒：
echo 1. 重启开发服务器才能生效：
echo    - 按 Ctrl+C 停止当前服务器
echo    - 运行：npm run dev
echo.
echo 2. 测试视频生成：
echo    - 访问：http://localhost:3000
echo    - 上传图片并输入运动描述
echo    - 点击生成视频
echo.
echo 3. 查看配置状态：
echo    - 双击运行 setup-api.bat
echo    - 选择选项 4
echo.
echo ==========================================
echo.
pause

:end
endlocal

