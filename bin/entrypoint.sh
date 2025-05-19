#!/bin/sh
set -e

# Copy .devcontainer if not present
target_dir="/workspace"
if [ ! -d "$target_dir/.devcontainer" ]; then
  cp -r /ngine-assets/.devcontainer "$target_dir/.devcontainer"
fi

# Copy .setup/config from templates if not present
if [ ! -d "$target_dir/.setup/configs" ]; then
  mkdir -p "$target_dir/.setup/configs"
  cp -r /ngine-assets/.setup/templates/* "$target_dir/.setup/configs/"
fi

exec "$@"
