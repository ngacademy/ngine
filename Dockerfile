# syntax=docker/dockerfile:1
FROM ubuntu:22.04

# Install only git, which is essential
RUN apt-get update && apt-get install -y \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a directory to hold template assets
RUN mkdir -p /ngine

# Copy .devcontainer and .setup/templates into the default workspace
COPY .devcontainer /ngine/.devcontainer
COPY .setup/templates /ngine/.setup/configs
COPY .setup/scripts /ngine/.setup/scripts

# Copy entrypoint script
COPY bin/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set default working directory
WORKDIR /workspace

# Entrypoint will scaffold the repo if needed
ENTRYPOINT ["/entrypoint.sh"]

# Default command (can be overridden)
CMD ["/bin/sh"]