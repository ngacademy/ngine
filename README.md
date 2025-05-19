# Ngine - Angular Enterprise Framework

A complete framework for building enterprise Angular applications with a structured, opinionated approach.

## Quickest Start (Docker Hub)

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

## VSCode DevContainer Integration

Add a `.devcontainer/devcontainer.json` file:

```json
{
  "name": "Ngine Development",
  "image": "ngacademy/ngine:latest",
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspace,type=bind",
  "workspaceFolder": "/workspace",
  "settings": {
    "terminal.integrated.defaultProfile.linux": "bash"
  },
  "extensions": [
    "angular.ng-template",
    "dbaeumer.vscode-eslint",
    "nrwl.angular-console"
  ],
  "forwardPorts": [4200, 4400, 9000-9099]
}
```

## Available Commands

```bash
# Initialize configuration
docker run -v $(pwd):/workspace ngacademy/ngine:latest init-config

# Create new project in workspace/ folder
docker run -v $(pwd):/workspace ngacademy/ngine:latest scaffold

# Use a specific config file
docker run -v $(pwd):/workspace ngacademy/ngine:latest scaffold --config /workspace/.setup/config/mycustom.yaml

# Run commands in the workspace
docker run -v $(pwd):/workspace ngacademy/ngine:latest run nx serve myapp

# Access shell
docker run -it -v $(pwd):/workspace ngacademy/ngine:latest shell
```

## For Maintainers

If you're developing Ngine itself, see the [Maintainer Instructions](.github/instructions/dx.instructions.md).

## License

MIT