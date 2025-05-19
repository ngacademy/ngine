#!/bin/bash
set -e

# Function to check if dev.js should run
should_run_devjs() {
  # Check if debug.yaml exists - if it does, don't run dev.js
  if [ -f "/workspace/.setup/configs/debug.yaml" ]; then
    echo "Debug mode detected, skipping dev.js"
    return 1
  fi
  
  # No debug file, so run dev.js
  return 0
}

echo "Starting container initialization..."

# Set NODE_PATH to include our pre-installed dependencies
DEPS_PATH="/usr/local/share/setup-deps/node_modules"

# Run nx.js
if [ -f "/workspace/.setup/scripts/nx.js" ]; then
  echo "Running NX workspace setup..."
  NODE_PATH="$DEPS_PATH" node /workspace/.setup/scripts/nx.js
fi

# Conditionally run dev.js
if should_run_devjs; then
  echo "Running development environment setup..."
  if [ -f "/workspace/.setup/scripts/dev.js" ]; then
    NODE_PATH="$DEPS_PATH" node /workspace/.setup/scripts/dev.js
  else
    echo "Warning: dev.js script not found."
  fi
else
  echo "Skipping dev.js setup (debug mode)"
fi

# Execute any commands passed to the script
exec "$@"