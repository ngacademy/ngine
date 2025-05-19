# syntax=docker/dockerfile:1
FROM node:22-bullseye

# Install pnpm, git, and any other required tools
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && apt-get update && apt-get install -y git

# Create a directory to hold template assets
RUN mkdir -p /ngine

# Copy .devcontainer and .setup/templates into the default workspace
COPY .devcontainer /workspace/ngine/.devcontainer
COPY .setup/templates /workspace/ngine/.setup/configs
COPY .setup/scripts /workspace/ngine/.setup/scripts

# Copy entrypoint script
COPY bin/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set default workspace mount point (for VSCode devcontainer)
WORKDIR /workspace

# Entrypoint will scaffold the repo if needed
ENTRYPOINT ["/entrypoint.sh"]

# Default command (can be overridden)
CMD ["/bin/sh"]