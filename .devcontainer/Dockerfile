FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Install global packages
RUN npm install -g nx @nrwl/cli js-yaml fs-extra

# Install additional tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set working directory
WORKDIR /workspace

# The node user is provided by the base image
USER node
