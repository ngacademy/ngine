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

# Run nx.js
if [ -f "/workspace/bin/nx.js" ]; then
  echo "Running NX workspace setup..."
  node /workspace/bin/nx.js
fi

# Conditionally run dev.js
if should_run_devjs; then
  echo "Running development environment setup..."
  if [ -f "/workspace/bin/dev.js" ]; then
    node /workspace/bin/dev.js
  else
    echo "Warning: dev.js script not found."
  fi
else
  echo "Skipping dev.js setup (debug mode)"
fi

# Execute any commands passed to the script
exec "$@"
else
  echo "Skipping dev.js setup (condition not met)"
fi

# Execute any commands passed to the script
exec "$@"
