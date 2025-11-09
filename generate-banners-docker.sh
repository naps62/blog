#!/usr/bin/env bash

# Script to generate meta images using Docker
# This avoids the need to install native dependencies on NixOS

set -e

echo "Building Docker image..."
docker build -f Dockerfile.banners -t blog-banners .

echo "Generating banners..."
docker run --rm \
  -v "$(pwd)/public/posts:/app/public/posts" \
  -v "$(pwd)/src/posts:/app/src/posts:ro" \
  -v "$(pwd)/assets:/app/assets:ro" \
  -v "$(pwd)/public/static:/app/public/static:ro" \
  -v "$(pwd)/scripts:/app/scripts:ro" \
  blog-banners

echo "Done! Generated images are in ./public/posts/"

sudo chown -R $USER public/posts
