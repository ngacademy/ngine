#!/bin/zsh
set -e

# ===================== ENV =====================

# define paths
REPO_NAME="ngine"
ROOT_DIR="/workspaces/$REPO_NAME"

# Check if root directory exists
if [ ! -d "$ROOT_DIR" ]; then
  echo "[ngine] Error: Root directory $ROOT_DIR does not exist."
  exit 1
fi

echo "[ngine] Starting container initialization..."
echo "[ngine] Repository name: $REPO_NAME"
echo "[ngine] Root directory: $ROOT_DIR"

# setup environment variables
export ROOT_DIR

if [ -f "$ROOT_DIR/.setup/configs/debug.yaml" ]; then
  export DEBUG_MODE=1
else
  export DEBUG_MODE=0
fi

# ===================== SHELL =====================

# # setup starship
# echo "[ngine] Setting up Starship prompt..."
# mkdir -p ~/.config/
# cp -r $ROOT_DIR/.setup/environment/starship.toml ~/.config/

# ===================== LOGS =====================

# Create .init folder to hold initialization marker files and logs
rm -rf ".init"
mkdir -p ".init"
touch ".init/init.log"

# ===================== JS =====================

# setup npm
echo "[ngine] Setting up npm configuration..."
node $ROOT_DIR/.setup/scripts/npm.setup.js

# # setup git
# echo "[ngine] Setting up git configuration..."
# NODE_PATH=$DEPS_PATH node $ROOT_DIR/.setup/scripts/git.setup.js

# # setup nx
# echo "[ngine] Setting up nx configuration..."
# NODE_PATH=$DEPS_PATH node $ROOT_DIR/.setup/scripts/nx.setup.js

# # run tests if configured
# /ngine/test.zsh

echo "[ngine] Container initialization complete."
