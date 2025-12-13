#!/bin/bash
# Script to expose ShopEase app publicly using ngrok or localtunnel
# Usage: ./expose-public.sh [ngrok|localtunnel] [port]

TOOL=${1:-ngrok}
PORT=${2:-3000}

echo "========================================"
echo "  ShopEase - Public URL Exposer"
echo "========================================"
echo ""

# Check if port is in use
if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Warning: Port $PORT is not in use. Make sure your app is running!"
    echo ""
fi

if [ "$TOOL" = "ngrok" ]; then
    echo "Using ngrok to expose port $PORT..."
    echo ""
    
    # Check if ngrok is installed
    if ! command -v ngrok &> /dev/null; then
        echo "❌ ngrok is not installed!"
        echo ""
        echo "Install ngrok:"
        echo "  macOS: brew install ngrok/ngrok/ngrok"
        echo "  Linux: Download from https://ngrok.com/download"
        echo ""
        echo "Alternative: Use localtunnel instead:"
        echo "  ./expose-public.sh localtunnel $PORT"
        exit 1
    fi
    
    echo "Starting ngrok tunnel on port $PORT..."
    echo "Your public URL will be displayed below:"
    echo ""
    echo "Press Ctrl+C to stop the tunnel"
    echo ""
    
    # Start ngrok
    ngrok http $PORT
else
    echo "Using localtunnel to expose port $PORT..."
    echo ""
    
    # Check if npx is available
    if ! command -v npx &> /dev/null; then
        echo "❌ npx is not installed! Please install Node.js first."
        exit 1
    fi
    
    echo "Starting localtunnel on port $PORT..."
    echo "Your public URL will be displayed below:"
    echo ""
    echo "Press Ctrl+C to stop the tunnel"
    echo ""
    
    # Start localtunnel
    SUBDOMAIN="shopease-$(shuf -i 1000-9999 -n 1)"
    echo "Requesting subdomain: $SUBDOMAIN"
    echo ""
    
    npx --yes localtunnel --port $PORT --subdomain $SUBDOMAIN
fi
