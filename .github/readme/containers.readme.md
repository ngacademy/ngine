---
applyTo: "**"
---
# Docker Setup in NGine

## Root Dockerfile (`/Dockerfile`)

- **Purpose**: Creates `ngacademy/ngine` image, pushed to Docker Hub
- **Contents**: Minimal image with:
  - `.devcontainer` folder - Environment isolation logic
  - `.setup/templates` - Configuration files
  - `.setup/scripts` - Helper scripts

## Development Workflow

The streamlined setup process:

1. Developer runs the published `ngacademy/ngine` image to initialize repository
2. The image copies required configuration files to the target directory
3. Developer opens project in VS Code devcontainer
4. Devcontainer environment handles project scaffolding

This approach ensures consistent development environments with minimal setup overhead.
