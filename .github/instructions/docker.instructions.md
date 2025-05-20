---
applyTo: "**"
---
# Docker Setup in NGine

There are two Dockerfiles in this repository, each serving a different purpose in the development workflow.

## 1. Root Dockerfile (`/Dockerfile`)

- **Purpose**: Creates a named image called `ngacademy/ngine`, which is publicly pushed to Docker Hub.
- **Contents**: This is a minimal image that only includes:
  - `.devcontainer` folder - Contains all the environment logic to run everything in an isolated manner
  - `.setup` folder - Contains configuration YAML files and helper JavaScript scripts to be run from inside the devcontainer

This image serves as the initial entry point for developers to get started with the project.

## 2. Development Container Dockerfile (`.devcontainer/Dockerfile`)

- **Purpose**: Used anonymously solely to create the development environment
- **Usage**: This Dockerfile is used by VS Code when opening the project in a devcontainer

## Development Workflow

The complete two-step setup process works as follows:

1. A developer uses the public `ngacademy/ngine` image to create an initialization folder
2. From there, they start VS Code in devcontainer mode
3. The devcontainer Docker image takes care of:
   - Scaffolding a whole NX monorepo
   - Initializing everything else needed for development

This approach provides an isolated, consistent development environment that's easy to set up and use across different developer machines.
