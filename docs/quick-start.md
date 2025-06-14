# Quick Start Guide

## Prerequisites

- Docker installed on your system
- Git (optional, for version control)

## Getting Started

### Method 1: Using Docker Hub Image

```bash
# Create a new project directory
mkdir my-angular-project && cd my-angular-project

# Run the Ngine container from Docker Hub
docker run -it -v $(pwd):/workspace ngacademy/ngine:latest

# Inside the container, initialize configuration
ngine init-config

# Edit the configuration file (optional)
# .setup/config/project.yaml

# Scaffold your project
ngine scaffold
```

### Method 2: Building Locally

```bash
# Clone the Ngine repository
git clone https://github.com/ngacademy/ngine.git
cd ngine

# Build the Docker image
docker build -t ngine:local .

# Create your project directory
mkdir ../my-angular-project && cd ../my-angular-project

# Run the local container
docker run -it -v $(pwd):/workspace ngine:local

# Inside the container, scaffold your project
ngine init-config
ngine scaffold
```

## What Gets Created

After scaffolding, you'll have:
- An NX workspace with Angular application
- Pre-configured libraries:
  - `@ngacademy/common-models`
  - `@ngacademy/common-utils`
  - `@ngacademy/lib-ngine`
- Firebase configuration with emulator setup
- Storybook configuration
- ESLint and testing setup
- VS Code settings

## Next Steps

After scaffolding is complete:

```bash
# Navigate to the workspace
cd workspace

# Install dependencies (if not already installed)
npm install

# Start the development server
nx serve [your-app-name]

# Run Storybook
nx run [your-app-name]:storybook

# Start Firebase emulators
firebase emulators:start
```

## Available Commands

Inside the Ngine container:
- `ngine init-config` - Initialize configuration templates
- `ngine scaffold` - Create a new Angular project
- `ngine shell` - Enter interactive shell
- `ngine version` - Show version information
- `ngine run <command>` - Run a command in the workspace

**Note**: The following commands are planned but not yet implemented:
- `ngine add-feature <name>` - Add a new feature module
- `ngine edit entity <name>` - Edit an entity model  
- `ngine upgrade angular` - Upgrade Angular version
