# Maintainer Guide

## Development Setup

If you're developing Ngine itself:

### Prerequisites
- Docker
- Node.js 18+
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ngacademy/ngine.git
   cd ngine
   ```

2. Build the Docker image:
   ```bash
   docker build -t ngacademy/ngine:dev .
   ```

3. Test locally:
   ```bash
   docker run -v $(pwd)/test:/workspace ngacademy/ngine:dev scaffold
   ```

## Docker Tasks

Available VS Code tasks:
- **Build Docker Image** - Builds the container locally
- **Docker Hub Login** - Login to Docker Hub
- **Push Docker Image** - Push to registry
- **Clean** - Remove generated files

## Testing

Run smoke tests:
```bash
./test/smoke.test.zsh
```

## Release Process

1. Update version in relevant files
2. Build and test locally
3. Push to Docker Hub:
   ```bash
   docker build -t ngacademy/ngine:latest .
   docker push ngacademy/ngine:latest
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request
