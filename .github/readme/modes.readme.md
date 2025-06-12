---
applyTo: "**"
---
# Operational Modes for ngine

This document describes the three primary modes of operation for running initialization logic in the ngine project.

## 1. Debug Mode

**Purpose**: Development within the ngine repository itself.

- Uses dev containers for the ngine repo
- When no project folder exists inside the container, init logic creates this folder
- Initializes an nx monorepo inside the container
- All development work happens through nx commands within the container
- Used for developing and testing the ngine tool itself

### Testing Debug Mode

**Test 1: Minimal Container Smoke Test**
- Verify container starts with basic setup (starship, node modules deps)
- Skip all JS setup scripts for minimal validation

**Verification Script**: `/ngine/tests/smoke.test.zsh`

## 2. Host Mode

**Purpose**: Create projects on the host machine with the option to use containers.

- Runs the ngacademy/ngine image outside of the ngine repo
- Creates a clean initialization folder on the host machine
- When opening the new repo in VS Code in devcontainer mode, it initializes the nx monorepo
- Allows switching between devcontainer mode and host mode
- Host machine can be used for operations like pushing changes to GitHub (using SSH keys on the host)
- Could theoretically use the host for coding if all dependencies are available there

### Testing Host Mode

<!-- Add your host mode testing steps here incrementally -->

## 3. Container Mode

**Purpose**: Complete isolation for working with repositories or PRs.

- Directly clones an existing repository with a .devcontainer folder into an isolated container volume
- Does not pollute local file system - uses Docker volumes instead of binding to local filesystem
- Offers improved performance on Windows and macOS through local volumes
- Allows working with isolated copies of repositories for PR reviews
- Enables investigation of branches without impacting local work
- Supports directly cloning individual PRs for review in isolation
- Creates a clean, performant development environment for each project

This mode uses the "Clone Repository in Container Volume" functionality of VS Code's Dev Containers extension, which stores code in a named Docker volume rather than the local filesystem for better isolation and performance.

### Testing Container Mode

<!-- Add your container mode testing steps here incrementally -->
