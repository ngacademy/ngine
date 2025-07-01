#!/bin/sh
set -e

# Get repo name from first argument, terminate setup script if not provided
if [ -z "$1" ]; then
  echo "[setup] Error: No target directory provided."
  exit 1
fi

REPO_NAME="$1"
DEV_FLAG="${2:-}"

echo "[setup] Starting project repo setup..."
echo "[setup] Project repo name: $REPO_NAME"

# Update the devcontainer init script with the provided repo name
INIT_SCRIPT="/ngine/.devcontainer/bin/init.zsh"
sed -i "s/REPO_NAME=\"ngine\".*$/REPO_NAME=\"$REPO_NAME\"/" "$INIT_SCRIPT"

# Copy the ngine setup files to the target directory
mkdir -p "$REPO_NAME"
cp -r /ngine/.devcontainer "$REPO_NAME/.devcontainer"

mkdir -p "$REPO_NAME/.setup/configs"
cp -r /ngine/.setup/scripts "$REPO_NAME/.setup/scripts"
cp -r /ngine/.setup/environment "$REPO_NAME/.setup/environment"

# Update docker-compose.yml workspace path to use the new repo name
DOCKER_COMPOSE="$REPO_NAME/.devcontainer/docker-compose.yml"
sed -i "s|workspaces/ngine|workspaces/$REPO_NAME|g" "$DOCKER_COMPOSE"

DOCKER_COMPOSE_DEV="$REPO_NAME/.devcontainer/docker-compose.dev.yml"
if [ "$DEV_FLAG" = "--dev" ]; then
  echo "[setup] Development mode enabled"
  # Update docker-compose.dev.yml workspace path to use the new repo name
  sed -i "s|workspaces/ngine|workspaces/$REPO_NAME|g" "$DOCKER_COMPOSE_DEV"
  # Copy a predefined dev config file
  cp -r /ngine/.setup/configs/dev.yaml "$REPO_NAME/.setup/configs/workspace.yaml"
else
  # Clear the docker-compose.dev.yml content
  echo "version: \"3.9\"\nservices:" >"$DOCKER_COMPOSE_DEV"
  # Copy an empty config file
  cp -r /ngine/.setup/configs/template.yaml "$REPO_NAME/.setup/configs/config.yaml"
fi

echo "[setup] Project repo setup complete."
