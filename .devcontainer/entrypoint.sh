#!/bin/bash
set -e

# Define path to repo root
REPO_NAME="ngine"
ROOT_DIR="/workspaces/$REPO_NAME"

# Check if root directory exists
if [ ! -d "$ROOT_DIR" ]; then
  echo "Error: Root directory $ROOT_DIR does not exist."
  exit 1
fi

# Function to check if nx.js should run
should_run_nxjs() {
  # First check if debug mode and no projects folder
  if [ -f "$ROOT_DIR/.setup/configs/debug.yaml" ] && [ ! -d "$ROOT_DIR/projects" ]; then
    echo "Debug mode detected and no projects folder, nx.js should run"
    return 0
  fi

  # Check if nx.json exists - if it does, don't run nx.js
  if [ ! -f "$ROOT_DIR/nx.json" ]; then
    echo "No nx.json found, nx.js should run"
    return 0
  fi

  # If nx.json does not exist, run nx.js
  return 1
}

# Function to check if dev.js should run
should_run_devjs() {
  # Check if debug.yaml exists - if it does, don't run dev.js
  if [ -f "$ROOT_DIR/.setup/configs/debug.yaml" ]; then
    echo "Debug mode detected, skipping dev.js"
    return 1
  fi

  # Check if nx.json exists - if it does, don't run nx.js
  if [ -f "$ROOT_DIR/nx.json" ]; then
    echo "nx.json found, skipping dev.js"
    return 1
  fi

  # No debug file or nx.json, so run dev.js
  return 0
}

# Function to check if git.js should run
should_run_gitjs() {
  # Check if a dedicated .gitignore file exists - if it does, no need to run git.js
  if [ -f "$ROOT_DIR/tmp/.gitignore" ]; then
    echo "Git repository already initialized, skipping git.js"
    return 1
  fi

  # No .gitignore file, run git.js
  return 0
}

# Function to check if npm install should run
should_run_npm_install() {
  if [ ! -d "$ROOT_DIR/node_modules" ] && [ ! -f "$ROOT_DIR/.setup/configs/debug.yaml" ]; then
    echo "No node_modules directory and no debug mode, npm install should run"
    return 0
  fi
  return 1
}

echo "Starting container initialization..."
echo "Repository name: $REPO_NAME"
echo "Root directory: $ROOT_DIR"

# Set NODE_PATH to include our pre-installed dependencies
DEPS_PATH="/usr/local/share/setup-deps/node_modules"

# Conditionally run nx.js
if should_run_nxjs; then
  if [ -f "$ROOT_DIR/.setup/scripts/nx.js" ]; then
    echo "Running NX workspace setup..."
    NODE_PATH="$DEPS_PATH" node $ROOT_DIR/.setup/scripts/nx.js
  else
    echo "Warning: nx.js script not found."
  fi
fi

# Conditionally run dev.js
if should_run_devjs; then
  echo "Running development environment setup..."
  if [ -f "$ROOT_DIR/.setup/scripts/dev.js" ]; then
    NODE_PATH="$DEPS_PATH" node $ROOT_DIR/.setup/scripts/dev.js
  else
    echo "Warning: dev.js script not found."
  fi
fi

# Conditionally run git.js
if should_run_gitjs; then
  if [ -f "$ROOT_DIR/.setup/scripts/git.js" ]; then
    echo "Running Git configuration setup..."
    NODE_PATH="$DEPS_PATH" node $ROOT_DIR/.setup/scripts/git.js

    # Create empty tmp/.gitignore file for conditional logic
    mkdir -p "$ROOT_DIR/tmp"
    touch "$ROOT_DIR/tmp/.gitignore"
  else
    echo "Warning: git.js script not found."
  fi
fi

# Run npm install if needed
if should_run_npm_install; then
  echo "Installing npm dependencies..."
  cd "$ROOT_DIR" && npm install
fi

# Execute any commands passed to the script
exec "$@"
