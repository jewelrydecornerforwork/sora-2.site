#!/bin/bash

# Sora-2 AI 视频生成器 - API 配置脚本
# 使用方法：bash setup-api.sh

echo "=========================================="
echo "  🎬 Sora-2 AI 视频生成器 - API 配置向导"
echo "=========================================="
echo ""

# 检查 .env.local 是否存在
if [ ! -f .env.local ]; then
    echo "❌ 错误：找不到 .env.local 文件"
    echo "正在从 env.example 创建..."
    cp env.example .env.local
    echo "✅ .env.local 文件已创建"
    echo ""
fi

echo "请选择您要配置的 API 服务："
echo ""
echo "1) Replicate API（推荐，每月免费 \$5，质量最佳）"
echo "2) Hugging Face API（完全免费，有速率限制）"
echo "3) 同时配置两个（推荐）"
echo "4) 查看当前配置"
echo "5) 退出"
echo ""
read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "=========================================="
        echo "  配置 Replicate API"
        echo "=========================================="
        echo ""
        echo "📝 步骤："
        echo "1. 访问：https://replicate.com/"
        echo "2. 注册账号（可使用 GitHub 登录）"
        echo "3. 访问：https://replicate.com/account/api-tokens"
        echo "4. 点击 'Create token'"
        echo "5. 复制生成的 Token（格式：r8_xxxxx...）"
        echo ""
        read -p "请粘贴您的 Replicate Token: " replicate_token
        
        if [[ $replicate_token == r8_* ]]; then
            # 使用 sed 替换 token
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|REPLICATE_API_TOKEN=\"r8_.*\"|REPLICATE_API_TOKEN=\"$replicate_token\"|" .env.local
            else
                # Linux
                sed -i "s|REPLICATE_API_TOKEN=\"r8_.*\"|REPLICATE_API_TOKEN=\"$replicate_token\"|" .env.local
            fi
            echo ""
            echo "✅ Replicate API Token 配置成功！"
        else
            echo ""
            echo "❌ Token 格式不正确（应该以 r8_ 开头）"
            echo "请重新运行脚本并检查 Token"
        fi
        ;;
        
    2)
        echo ""
        echo "=========================================="
        echo "  配置 Hugging Face API"
        echo "=========================================="
        echo ""
        echo "📝 步骤："
        echo "1. 访问：https://huggingface.co/"
        echo "2. 注册账号"
        echo "3. 访问：https://huggingface.co/settings/tokens"
        echo "4. 点击 'New token'"
        echo "5. 权限选择 'Read'"
        echo "6. 复制生成的 Token（格式：hf_xxxxx...）"
        echo ""
        read -p "请粘贴您的 Hugging Face Token: " hf_token
        
        if [[ $hf_token == hf_* ]]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|HF_API_TOKEN=\"hf_.*\"|HF_API_TOKEN=\"$hf_token\"|" .env.local
            else
                sed -i "s|HF_API_TOKEN=\"hf_.*\"|HF_API_TOKEN=\"$hf_token\"|" .env.local
            fi
            echo ""
            echo "✅ Hugging Face API Token 配置成功！"
        else
            echo ""
            echo "❌ Token 格式不正确（应该以 hf_ 开头）"
            echo "请重新运行脚本并检查 Token"
        fi
        ;;
        
    3)
        echo ""
        echo "=========================================="
        echo "  同时配置两个 API（推荐）"
        echo "=========================================="
        echo ""
        
        # Replicate
        echo "--- Replicate API ---"
        echo "访问：https://replicate.com/account/api-tokens"
        read -p "请粘贴您的 Replicate Token: " replicate_token
        
        # Hugging Face
        echo ""
        echo "--- Hugging Face API ---"
        echo "访问：https://huggingface.co/settings/tokens"
        read -p "请粘贴您的 Hugging Face Token: " hf_token
        
        # 配置 Replicate
        if [[ $replicate_token == r8_* ]]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|REPLICATE_API_TOKEN=\"r8_.*\"|REPLICATE_API_TOKEN=\"$replicate_token\"|" .env.local
            else
                sed -i "s|REPLICATE_API_TOKEN=\"r8_.*\"|REPLICATE_API_TOKEN=\"$replicate_token\"|" .env.local
            fi
            echo "✅ Replicate 配置成功"
        else
            echo "⚠️ Replicate Token 格式不正确，已跳过"
        fi
        
        # 配置 Hugging Face
        if [[ $hf_token == hf_* ]]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|HF_API_TOKEN=\"hf_.*\"|HF_API_TOKEN=\"$hf_token\"|" .env.local
            else
                sed -i "s|HF_API_TOKEN=\"hf_.*\"|HF_API_TOKEN=\"$hf_token\"|" .env.local
            fi
            echo "✅ Hugging Face 配置成功"
        else
            echo "⚠️ Hugging Face Token 格式不正确，已跳过"
        fi
        ;;
        
    4)
        echo ""
        echo "=========================================="
        echo "  当前配置状态"
        echo "=========================================="
        echo ""
        
        replicate=$(grep "REPLICATE_API_TOKEN=" .env.local | cut -d'"' -f2)
        hf=$(grep "HF_API_TOKEN=" .env.local | cut -d'"' -f2)
        
        if [[ $replicate == r8_* ]] && [[ ${#replicate} -gt 10 ]]; then
            echo "✅ Replicate API: 已配置"
            echo "   Token: ${replicate:0:15}...${replicate: -5}"
        else
            echo "❌ Replicate API: 未配置"
        fi
        
        echo ""
        
        if [[ $hf == hf_* ]] && [[ ${#hf} -gt 10 ]]; then
            echo "✅ Hugging Face API: 已配置"
            echo "   Token: ${hf:0:15}...${hf: -5}"
        else
            echo "❌ Hugging Face API: 未配置"
        fi
        
        echo ""
        exit 0
        ;;
        
    5)
        echo "已退出配置向导"
        exit 0
        ;;
        
    *)
        echo "❌ 无效的选项"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  🎉 配置完成！"
echo "=========================================="
echo ""
echo "⚠️  重要提醒："
echo "1. 重启开发服务器才能生效："
echo "   - 按 Ctrl+C 停止当前服务器"
echo "   - 运行：npm run dev"
echo ""
echo "2. 测试视频生成："
echo "   - 访问：http://localhost:3000"
echo "   - 上传图片并输入运动描述"
echo "   - 点击生成视频"
echo ""
echo "3. 查看配置状态："
echo "   bash setup-api.sh"
echo "   然后选择选项 4"
echo ""
echo "=========================================="

