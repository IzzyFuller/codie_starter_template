#!/bin/bash

# Docker test runner for AI Assistant Starter Template
# Builds Docker image and runs automated tests in isolated environment

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  AI Assistant Template - Docker Tests${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Build Docker image
echo -e "${BLUE}→ Building Docker test environment...${NC}"
docker build -f Dockerfile.test -t ai-assistant-test .
echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# Run tests in container
echo -e "${BLUE}→ Running automated tests in Docker container...${NC}"
echo ""
docker run --rm ai-assistant-test ./test_installation.sh

echo ""
echo -e "${GREEN}✓ Docker tests complete!${NC}"
