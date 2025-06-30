# 🌌 Cosmic Insights

**Cosmic Insights** is a full-stack web application that allows users to explore and visualize data from NASA's open APIs in an intuitive and interactive way. It offers a clean and responsive user interface, backed by a robust Node.js + Express backend, to fetch and display a wide variety of space-related content.

## 🚀 Live Demo

🔗 [Visit the live app here](https://project-cosmic.vercel.app/)  
🔗 [GitHub Repository](https://github.com/Anandhu09/project_cosmic.git)

---

## 📁 Project Structure

<pre>
cosmic_insights/
├── frontend/ # React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── backend/ # Node.js + Express API server
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── server.js
│   └── package.json
└── README.md
</pre>

## ✨ Features

- NASA API Integration: Fetches real-time data for exoplanets, NEOs, and Mars weather insights.
- Data Visualization: Interactive charts and 3D visualizations using Chart.js and Three.js.
- Search and Filter: Filter exoplanets by star type and radius, with pagination support.
- Responsive Design: Mobile-friendly UI built with TailwindCSS.
- Error Handling: Graceful handling of loading and error states.
- Modular Architecture: Clean, maintainable code with centralized configuration.

---

## 🔧 Tech Stack

**Frontend**

- React (with Hooks)
- TypeScript
- Axios (HTTP requests)
- Chart.js (data visualization)
- Three.js (3D visualizations)
- TailwindCSS (styling)
- Vite (build tool)

**Backend**

- Node.js
- Express.js
- TypeScript
- Mongoose (MongoDB ORM)
- Axios (NASA API requests)
- memory-cache (caching)
- dotenv (environment variables)
- CORS, Helmet, Morgan, express-rate-limit (middleware)

**Database**

- MongoDB (cloud-hosted via MongoDB Atlas)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18.x
- npm

### Clone the repository

```bash
   git clone https://github.com/Anandhu09/project_cosmic.git
   cd cosmic_insights
```

### Backend Setup

```bash
cd backend
npm install
```

### Create a backend .env file

Create a .env file inside the backend/ folder with:

```bash
echo "NASA_API_KEY=your_nasa_api_key" > .env
```
Environmental variables 

```bash
MONGO_URI=mongodb+srv://Anandhu:oJ2PB0B34JBSt4NE@anandhucluster.rkahsgv.mongodb.net/NASA?retryWrites=true&w=majority&appName=AnandhuCluster
PORT=3000
NASA_API_KEY=ht9JSuW7j0v8g9I908cTGRTcC8UnyHsYcxVdpeDW
```

## Start the backend app:

- In Development mode

```bash
npm run dev
```

- In Production mode

```bash
npm start
```

## Frontend Setup

cd frontend  
npm install  
npm start

Create frontend .env file
Create a .env file inside the frontend/ folder with:

VITE_API_URL=https://project-cosmic.onrender.com

## Start the frontend app:

```bash
npm start
```
Use the link in the terminal to open the web app
