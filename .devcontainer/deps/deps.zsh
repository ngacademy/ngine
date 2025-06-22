#!/bin/zsh

# Script to conditionally install setup dependencies
# Only installs if node_modules doesn't exist or is empty

SETUP_DEPS_DIR="/usr/local/share/setup-deps"
NODE_MODULES_DIR="$SETUP_DEPS_DIR/node_modules"

echo "[deps] Checking if setup dependencies need to be installed..."


if [ ! -d "$NODE_MODULES_DIR" ] || [ -z "$(ls -A "$NODE_MODULES_DIR" 2>/dev/null)" ]; then
    echo "[deps] Installing setup dependencies..."
    cd "$SETUP_DEPS_DIR" && npm install --silent
    echo "[deps] Setup dependencies installed successfully"
else
    echo "[deps] Setup dependencies already exist, skipping installation"
fi
