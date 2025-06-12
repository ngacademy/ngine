#!/bin/zsh
set -e

# define paths
REPO_NAME="ngine"
ROOT_DIR="/workspaces/$REPO_NAME"

# Check if root directory exists
if [ ! -d "$ROOT_DIR" ]; then
  echo "Error: Root directory $ROOT_DIR does not exist."
  exit 1
fi

echo "- Starting container initialization..."
echo "Repository name: $REPO_NAME"
echo "Root directory: $ROOT_DIR"

# setup environment variables
export ROOT_DIR

# setup starship
echo "Setting up Starship prompt..."
mkdir -p ~/.config/
cp -r $ROOT_DIR/.setup/environment/starship.toml ~/.config/

# setup npm
echo "Setting up npm configuration..."
node $ROOT_DIR/.setup/scripts/npm.setup.js

# setup git
echo "Setting up git configuration..."
NODE_PATH=$DEPS_PATH node $ROOT_DIR/.setup/scripts/git.setup.js

# setup nx
echo "Setting up nx configuration..."
NODE_PATH=$DEPS_PATH node $ROOT_DIR/.setup/scripts/nx.setup.js

# run tests if configured
/ngine/test.zsh

echo "- Container initialization complete."
