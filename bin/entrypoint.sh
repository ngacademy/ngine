#!/bin/sh
set -e

# Get repo name from first argument, return if not provided
if [ -z "$1" ]; then
  echo "Error: No target directory provided."
  exit 1
fi

REPO_NAME="$1"

echo "- Starting repository initialization..."
echo "Repository name: $REPO_NAME"

# Copy the ngine setup files to the target directory
mkdir -p "$REPO_NAME"
ENTRYPOINT_SH="/ngine/.devcontainer/entrypoint.sh"
sed -i "s/REPO_NAME=\"ngine\".*$/REPO_NAME=\"$REPO_NAME\"/" "$ENTRYPOINT_SH"
cp -r /ngine/.devcontainer "$REPO_NAME/.devcontainer"
mkdir -p "$REPO_NAME/.setup"
cp -r /ngine/.setup/scripts "$REPO_NAME/.setup/scripts"
cp -r /ngine/.setup/configs "$REPO_NAME/.setup/configs"

# Create empty tmp/.gitkeep file for conditional logic
mkdir -p "$REPO_NAME/tmp"
touch "$REPO_NAME/tmp/.gitkeep"

echo "- Repository initialization complete."

# Shift the first argument so CMD works as expected
shift
exec "$@"
