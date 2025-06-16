# syntax=docker/dockerfile:1
FROM ubuntu:22.04

# Install only essential packages
RUN apt-get update && apt-get install -y \
    # git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a directory to hold setup assets
RUN mkdir -p /ngine

# Prepare setup assets
COPY .devcontainer /ngine/.devcontainer
COPY .setup/templates /ngine/.setup/configs
COPY .setup/scripts /ngine/.setup/scripts

# Prepare setup script
COPY bin/setup.sh /setup.sh
RUN chmod +x /setup.sh
ENTRYPOINT ["/setup.sh"]

# Set default working directory
WORKDIR /workspace