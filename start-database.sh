#!/bin/bash

source .env

container_name="$DB_USER-$DB_NAME"

if docker ps -a --format '{{.Names}}' | grep -q "^$container_name$"; then
  echo "Container $container_name already exists. Starting it..."
  docker start "$container_name"
else
  echo "Creating and starting container $container_name..."
  docker run --name "$container_name" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -p "$DB_PORT":5432 \
    -d postgres:latest
fi
