#!/bin/sh
set -e

# Get target dir from first argument, return if not provided
if [ -z "$1" ]; then
  echo "Error: No target directory provided."
  exit 1
fi
target_dir="$1"
mkdir -p "$target_dir"

# Copy the ngine setup files to the target directory
cp -r ngine/.devcontainer "$target_dir/.devcontainer"
mkdir -p "$target_dir/.setup"
cp -r ngine/.setup/templates "$target_dir/.setup/configs"
cp -r ngine/.setup/scripts "$target_dir/.setup/scripts"

echo "Ngine init completed successfully!"

# Shift the first argument so CMD works as expected
shift
exec "$@"
