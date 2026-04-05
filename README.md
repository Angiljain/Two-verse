# TwoVerse – A Private Digital World for Couples

## Requirements
- Node.js (v18+)
- MongoDB running locally on `localhost:27017`

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. (Run automatically by AI already, but available if needed) `npm install`.
3. The `.env` file is pre-filled for local development.
4. Run the backend server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a second terminal and navigate to the `frontend` folder.
2. (Run automatically by AI already) `npm install`.
3. Make sure the backend is running.
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   *The app will start on `http://localhost:3000`.*

## Testing the App (Pairing Simulation)
To test the core functionality, you need to simulate two people:
1. Open your browser to `http://localhost:3000`. Create an account (e.g., Person A).
2. Generate an "Invite Code" on the pairing screen.
3. Open an **Incognito Window** or a different browser to `http://localhost:3000`. Create a separate account (e.g., Person B).
4. Enter Person A's Invite Code in the "Join Partner" field for Person B.
5. Both accounts will instantly be paired and redirected to your private dashboard!
6. Open the **Private Chat** on both screens to test the real-time WebSocket connection.
7. Try adding Love notes, Calendar Events, and Memories. You will see them synced and isolated to only your specific "Couple" instance.

Enjoy your private TwoVerse! 💜
