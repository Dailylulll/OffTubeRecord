# OffTube Record

A full-stack application for recording and viewing YouTube video histories and comments.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher) or a MongoDB Atlas cluster

## MongoDB Setup

### Local Installation (Linux)

1. Install MongoDB Community Edition:
   ```bash
   sudo apt update
   sudo apt install -y mongodb
   ```
2. Start the MongoDB service:
   ```bash
   sudo systemctl start mongodb
   ```
3. Enable automatic start on boot:
   ```bash
   sudo systemctl enable mongodb
   ```
4. Verify MongoDB is running on port 27017:
   ```bash
   sudo systemctl status mongodb
   ```

## Project Structure

- `/client` — React front-end application
- `/server` — Express back-end API server

## Setup & Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd OffTubeRecord
   ```

2. Install dependencies for both client and server:

   ```bash
   # From project root
   npm install # installs dev dependencies (concurrently)

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   cd ..
   ```

3. Create environment variables for the server:

   In `/server`, create a `.env` file with the following keys:

   ```dotenv
   MONGO_URI=<your_mongo_connection_string>
   JWT_SECRET=<your_jwt_secret>
   YOUTUBE_API_KEY=<your_youtube_api_key>
   PORT=5000
   TEST_VIDEOS=false
   ```

   ### Getting your MONGO_URI

   - For a local MongoDB instance, you can use:
     ```bash
     mongodb://localhost:27017/offtuberecord
     ```
   - If using MongoDB Atlas, copy the connection string from your cluster dashboard and replace `<username>`, `<password>`, and `<your_default_db>`.

   ### Generating a JWT_SECRET

   Generate a strong secret with one of the following commands:

   ```bash
   openssl rand -base64 32
   ```

   or

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## Running the Application

### Development Mode

From the project root, run:

```bash
npm run dev
```

This will start both the server (on port 5000) and the client (on port 3000) concurrently.

### Running Individually

- **Server only**:
  ```bash
  npm run server
  ```
  Runs the Express server on [http://localhost:5000](http://localhost:5000).

- **Client only**:
  ```bash
  npm run client
  ```
  Runs the React app on [http://localhost:3000](http://localhost:3000).

## Seeding the Database

Once your environment is configured and dependencies are installed, you can populate the database with test seed data (a user, a sample video history, and a comment) by running:

```bash
cd server
npm run seed
```
**Test user info**
name: 'Test User',
email: 'test@example.com',
password: 'password123'

## Production Build

To build the client for production:

```bash
cd client
npm run build
``` 

Serve the contents of `client/build` with any static server or integrate with the server’s static middleware.

## Scripts Overview

| Command            | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Start client and server concurrently               |
| `npm run server`   | Start server only                                  |
| `npm run client`   | Start client only                                  |
| `npm install`      | Install project (root) dependencies (dev tools)    |
| `npm install`      | Install server/client dependencies in each folder  |

