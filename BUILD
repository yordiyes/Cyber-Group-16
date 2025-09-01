'''It is just for sample'''
  Prerequisites

Make sure the following are installed:

 Go ≥ 1.20  
 Python ≥ 3.10  
 Node.js ≥ 18 (for dashboard)  
 Docker (optional, for containerized deployment)  
 SQLite or LiteDB (for local storage)


  Step-by-Step Build Instructions
1. Clone the Repository
git clone https://github.com/Cyber-Group-16/cyber-defense-tool.git
cd cyber-defense-tool

2. Set Up Backend (Go)
cd backend
go mod tidy
go run main.go



This starts the REST API server for network monitoring and data handling.


3. Install CLI Tool (Python)
cd cli
pip install -r requirements.txt
python cli.py --help



Use the CLI to run phishing scans, web scans, and generate reports.


4. Run Web App Scanner
cd scanner
pip install -r requirements.txt
python scan.py --target https://example.com



This module crawls and scans web apps for vulnerabilities.


5. Launch Dashboard (React + TypeScript)
cd dashboard
npm install
npm run dev



Opens the analyst dashboard at http://localhost:3000.


6. Install Browser Extension

 Navigate to /extension
 Load the unpacked extension in Chrome/Edge via chrome://extensions
 Enable developer mode and select the folder


7. Configure Environment Variables

Create a .env file in the root directory:
API_URL=http://localhost:8080
DB_PATH=./data/cyberdefense.db


8. Optional: Run with Docker
docker-compose up --build



Spins up all services in isolated containers.


  Final Notes

 All data is stored locally unless explicitly exported
 Logs and reports are saved in /reports
