#!/bin/zsh
set -e

# ===================== LOGS =====================

# Create .init folder to hold initialization marker files and logs
rm -rf ".init"
mkdir -p ".init"
touch ".init/init.log"

# ===================== ENV =====================

# define paths
REPO_NAME="ngine"
ROOT_DIR="/workspaces/$REPO_NAME"

# Check if root directory exists
if [ ! -d "$ROOT_DIR" ]; then
  MSG="[ngine] Error: Root directory $ROOT_DIR does not exist."
  echo "$MSG" | tee -a .init/init.log
  exit 1
fi

MSG="[init] Starting container initialization..."
echo "$MSG" | tee -a .init/init.log
MSG="[init] Repository name: $REPO_NAME"
echo "$MSG" | tee -a .init/init.log
MSG="[init] Root directory: $ROOT_DIR"
echo "$MSG" | tee -a .init/init.log

# run dependency setup script
sudo chown -R node:node /usr/local/share/setup-deps
/ngine/deps.zsh

# give access to the workspace directory
sudo chown -R node:node /workspaces/$REPO_NAME/project

# setup environment variables
export ROOT_DIR
export NODE_PATH="/usr/local/share/setup-deps/node_modules"

if [ -f "$ROOT_DIR/.setup/configs/debug.yaml" ]; then
  export DEBUG_MODE=1
  touch ".init/.debug-mode"
else
  export DEBUG_MODE=0
fi

# run dev flag logic
if [ -f "$ROOT_DIR/.devcontainer/docker-compose.dev.yml" ]; then
  export DEV_FLAG=1
  touch ".init/.dev-flag"
fi

# ===================== SHELL =====================

# setup starship
MSG="[init] Setting up Starship prompt..."
echo "$MSG" | tee -a .init/init.log
mkdir -p ~/.config/
cp -r $ROOT_DIR/.setup/environment/starship.toml ~/.config/

# ===================== JS/TS =====================

MSG="[init] Running main init script..."
echo "$MSG" | tee -a .init/init.log
node $ROOT_DIR/.setup/scripts/main.init.js

# ===================== TESTS =====================

# # run tests if configured
# /ngine/test.zsh

MSG="[init] Container initialization complete."
echo "$MSG" | tee -a .init/init.log
