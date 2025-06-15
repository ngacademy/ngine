# Quick Start Guide

This guide helps you get started with Ngine for Angular + Firebase development.

## Prerequisites

- Docker Desktop installed and running
- VS Code with the "Dev Containers" extension
- Git configured on your machine

## Choose Your Scenario

### 🆕 Scenario 1: Creating a New Project

**Step 1: Scaffold the project**
```bash
# Create and enter your project directory
mkdir my-awesome-app && cd my-awesome-app

# Run the Ngine scaffolding
docker run -it --rm -v $(pwd):/workspace ghcr.io/ngacademy/ngine my-awesome-app
```

**Step 2: Configure your project**
```bash
# Edit the configuration file
code .setup/configs/workspace.yaml
```

Fill in your details:
```yaml
git:
  user:
    name: "Your Name"
    email: "your.email@example.com"
  remote: "git@github.com:yourorg/my-awesome-app.git"  # Create this repo on GitHub first

project:
  appName: "app"      # Your Angular app name
  libName: "shared"   # Your shared library name
```

**Step 3: Open in VS Code**
1. Open the project folder in VS Code: `code .`
2. When prompted, click "Reopen in Container"
3. Wait for the container to build (first time takes ~5 minutes)
4. The setup scripts will automatically:
   - Initialize git
   - Create the NX workspace
   - Install dependencies
   - Configure your development environment

**Step 4: Start developing**
```bash
# Inside the container terminal
nx serve app
```

Your app will be available at http://localhost:4200

**Step 5: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 🚀 Scenario 2: Joining an Existing Project

**Option A: Using VS Code (Recommended)**
1. Open VS Code
2. Press `Cmd/Ctrl + Shift + P` → "Dev Containers: Clone Repository in Container Volume..."
3. Enter your repository URL
4. Choose "Create a unique volume"
5. VS Code will clone and set up everything automatically

**Option B: Manual Clone to Volume**
```bash
# Clone directly into a Docker volume for best performance
docker run -it --rm \
  -v my-app-volume:/workspace \
  -w /workspace \
  alpine/git clone https://github.com/yourorg/my-awesome-app.git .

# Then open VS Code and attach to the volume
code .
```

## Performance Tips

### Why Use Docker Volumes?

- **Bind mounts** (Scenario 1): Good for initial setup, but slower on Mac/Windows
- **Docker volumes** (Scenario 2): 3-5x faster file operations

### When to Switch to Volumes

After creating a new project and pushing to Git, consider switching to volume-based development:

1. Close VS Code
2. Delete local folder
3. Follow "Scenario 2" to clone into a volume

This is especially important if you notice:
- Slow npm installs
- Slow builds
- High CPU usage during file watching

## Common Commands

Inside the dev container:

```bash
# Serve the app
nx serve app

# Run tests
nx test app
nx e2e app-e2e

# Build for production
nx build app

# Generate a new component
nx g @angular/component my-component --project=app

# Generate a new library
nx g @nrwl/angular:library my-feature

# Check affected projects
nx affected:test
```

## Troubleshooting

### Container won't start
- Ensure Docker is running
- Check Docker resources (at least 4GB RAM allocated)
- Try: `docker system prune` to clean up

### Port 4200 already in use
- The dev server binds to 0.0.0.0:4200
- Check for other running containers: `docker ps`
- Stop conflicting containers

### Changes not reflecting
- The dev server should hot-reload automatically
- If not, restart the server: `Ctrl+C` then `nx serve app`

### Git permissions issues
- The container runs as the `node` user
- Git is pre-configured in the container
- If needed, reconfigure: `git config --global user.name "Your Name"`

## Next Steps

- Explore the generated NX workspace structure
- Set up Firebase: See `docs/firebase-setup.md`
- Configure CI/CD: See `docs/ci-cd.md`
- Learn about the architecture: See `docs/architecture.md` 