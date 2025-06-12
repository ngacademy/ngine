# Configuration Guide

## Configuration Structure

Ngine uses YAML configuration files located in `.setup/config/`:

```
.setup/
├── config/
│   ├── default.yaml     # Default configuration
│   ├── custom.yaml      # Your custom overrides
│   └── examples/        # Example configurations
└── templates/           # Project templates
```

## Basic Configuration

```yaml
# .setup/config/custom.yaml
project:
  name: "my-angular-app"
  prefix: "app"
  routing: true
  
workspace:
  nx: true
  packageManager: "npm"
  
features:
  storybook: true
  testing: true
  linting: true
```

## Advanced Configuration

### Multi-App Workspace
```yaml
workspace:
  type: "multi-app"
  apps:
    - name: "web-app"
      type: "application"
    - name: "mobile-app" 
      type: "application"
    - name: "shared-lib"
      type: "library"
```

### Custom Generators
```yaml
generators:
  component:
    style: "scss"
    changeDetection: "OnPush"
  service:
    providedIn: "root"
```

## Environment Variables

Configuration supports environment variable substitution:

```yaml
project:
  name: "${PROJECT_NAME:-default-app}"
  database:
    url: "${DATABASE_URL}"
```

## Validation

Ngine validates your configuration before scaffolding:
- Required fields
- Valid Angular naming conventions
- Compatible feature combinations
