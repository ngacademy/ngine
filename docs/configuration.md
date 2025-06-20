# Configuration Guide

This guide explains how to configure your project using the `workspace.yaml` file.

## Overview

The `workspace.yaml` file contains essential configuration settings for your project, including Git settings and project metadata. This file should be customized for your specific project needs.

## Git Configuration

### User Settings

Configure your Git user information for commits:

```yaml
git:
  user:
    name: "Your Full Name"     # The name that will appear in Git commits
    email: "your@email.com"    # The email address for Git commits
```

**Example:**
```yaml
git:
  user:
    name: "John Doe"
    email: "john.doe@example.com"
```

### Remote Repository

Set up your Git remote repository URL:

```yaml
git:
  remote: "git@github.com:username/repository.git"  # SSH format (recommended)
  # or
  remote: "https://github.com/username/repository.git"  # HTTPS format
```

**Examples:**
```yaml
# SSH format (recommended for authenticated access)
git:
  remote: "git@github.com:mycompany/my-project.git"

# HTTPS format (for public repositories or token-based auth)
git:
  remote: "https://github.com/mycompany/my-project.git"
```

## Project Configuration

### Application Name

Set the name of your application:

```yaml
project:
  appName: "my-awesome-app"  # Used for app identification and deployment
```

**Guidelines:**
- Use lowercase letters, numbers, and hyphens
- Avoid spaces and special characters
- Keep it concise and descriptive

### Library Name

Set the name of your library (if applicable):

```yaml
project:
  libName: "my-utility-lib"  # Used for library packaging and distribution
```

**Guidelines:**
- Follow the same naming conventions as appName
- Should reflect the library's purpose
- Consider namespace conventions for your organization
