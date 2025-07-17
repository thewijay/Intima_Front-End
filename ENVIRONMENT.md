# Environment Configuration

This project uses environment variables to configure API endpoints and other settings. This allows you to easily switch between different environments (development, testing, production) without modifying code.

## Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific configuration:

   ```bash
   # For local development
   EXPO_PUBLIC_BASE_URL=http://localhost:8000

   # For device testing (replace with your machine's IP)
   EXPO_PUBLIC_BASE_URL=http://192.168.1.100:8000
   ```

## Environment Variables

| Variable               | Description                                                          | Default                 |
| ---------------------- | -------------------------------------------------------------------- | ----------------------- |
| `EXPO_PUBLIC_BASE_URL` | Base URL for the backend server (includes both API and AI endpoints) | `http://localhost:8000` |

## Important Notes

- All environment variables for Expo must be prefixed with `EXPO_PUBLIC_` to be accessible in the client code
- The `.env` file is ignored by git to prevent accidentally committing sensitive information
- If environment variables are not set, the app will use localhost defaults
- For device testing, you need to use your machine's IP address instead of localhost
- The app automatically appends `/api` and `/ai` paths to the base URL for different endpoints

## Finding Your IP Address

### On macOS/Linux:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### On Windows:

```cmd
ipconfig | findstr "IPv4"
```

Use the IP address from your local network (usually starts with 192.168.x.x or 10.x.x.x).
