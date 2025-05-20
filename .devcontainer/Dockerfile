FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Install global packages
RUN npm install -g nx @nrwl/cli

# Install additional tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and install dependencies for setup scripts
COPY package.json /usr/local/share/setup-deps/package.json
WORKDIR /usr/local/share/setup-deps
RUN npm install --silent

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set working directory
WORKDIR /workspaces

# The node user is provided by the base image
USER node
