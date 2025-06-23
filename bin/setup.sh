#!/bin/sh
set -e

# Get repo name from first argument, terminate setup script if not provided
if [ -z "$1" ]; then
  echo "[setup] Error: No target directory provided."
  exit 1
fi

REPO_NAME="$1"

echo "[setup] Starting project repo setup..."
echo "[setup] Project repo name: $REPO_NAME"

# Update the devcontainer init script with the provided repo name
INIT_SCRIPT="/ngine/.devcontainer/bin/init.zsh"
sed -i "s/REPO_NAME=\"ngine\".*$/REPO_NAME=\"$REPO_NAME\"/" "$INIT_SCRIPT"

# Copy the ngine setup files to the target directory
mkdir -p "$REPO_NAME"
cp -r /ngine/.devcontainer "$REPO_NAME/.devcontainer"
mkdir -p "$REPO_NAME/.setup"
cp -r /ngine/.setup/scripts "$REPO_NAME/.setup/scripts"
cp -r /ngine/.setup/configs "$REPO_NAME/.setup/configs"
cp -r /ngine/.setup/environment "$REPO_NAME/.setup/environment"

echo "[setup] Project repo setup complete."
