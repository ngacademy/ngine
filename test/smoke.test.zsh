#!/bin/zsh
set -e

echo "=== Debug Mode: Minimal Container Smoke Test ==="

# Validate required config
echo "Validating config..."
CONFIG_FILE="$ROOT_DIR/.setup/configs/debug.yaml"
[ -f "$CONFIG_FILE" ] || { echo "❌ debug.yaml not found"; exit 1; }

SKIP_DEV=$(grep "skip-dev:" "$CONFIG_FILE" | cut -d: -f2 | xargs)
[ "$SKIP_DEV" = "true" ] || { echo "❌ skip-dev must be true for smoke test"; exit 1; }

# Check starship installation
echo "Checking starship installation..."
starship --version

# Verify node modules deps
echo "Verifying node modules..."
ls $DEPS_PATH

# Validate environment
echo "Validating environment..."
echo "ROOT_DIR: $ROOT_DIR"
[ -n "$ROOT_DIR" ]

# Test zsh config
echo "Testing zsh config..."
grep starship ~/.zshrc

echo "✅ All smoke tests passed"
