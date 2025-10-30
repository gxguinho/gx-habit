#!/bin/sh
set -e

echo "🚀 Starting GX-Habit Backend..."

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
  echo "⏳ Waiting for PostgreSQL to be ready..."

  # Extract connection details from DATABASE_URL
  # Format: postgresql://user:password@host:port/database
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\(.*\):[0-9]*.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

  max_attempts=30
  attempt=1

  while [ $attempt -le $max_attempts ]; do
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
      echo "✅ PostgreSQL is ready!"
      return 0
    fi

    echo "⏳ Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
    sleep 2
    attempt=$((attempt + 1))
  done

  echo "❌ Failed to connect to PostgreSQL after $max_attempts attempts"
  exit 1
}

# Wait for PostgreSQL
wait_for_postgres

# Navigate to the root directory to run migrations
cd /app

echo "📦 Running database migrations..."
if bun run db:migrate; then
  echo "✅ Migrations completed successfully!"
else
  echo "⚠️  Migrations failed or no migrations to run"
  # Don't exit, continue to start the server
fi

# Navigate back to server directory
cd /app/apps/server

echo "🎯 Starting server..."
exec node dist/index.js
