# Quick Start Guide

## Docker Hub Method (Recommended)

The fastest way to get started with Ngine:

```bash
# Create a new project folder
mkdir my-ngine-project && cd my-ngine-project

# Initialize configuration
npx @ngacademy/ngine-setup init

# (Optional) Edit configuration in .setup/config/

# Run directly from Docker Hub
docker run -v $(pwd):/workspace ngacademy/ngine:latest scaffold

# The project will be scaffolded in the "workspace" folder
```

## Using Custom Configuration

1. Create a project folder
2. Initialize configuration:
   ```bash
   npx @ngacademy/ngine-setup init
   ```
3. Edit your configuration files in the `.setup/config/` directory
4. Run the Docker container:
   ```bash
   docker run -v $(pwd):/workspace ngacademy/ngine:latest scaffold
   ```

## Next Steps

- Check out the [Configuration Guide](configuration.md) to customize your setup
- See [Available Commands](commands.md) for all Docker operations
- Learn about [VSCode Integration](vscode-integration.md) for development
