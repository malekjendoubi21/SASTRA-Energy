import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BackOfficeMenu from "../components/BackOfficeMenu";
import "./Dashboard.css";

// Fix icon par défaut Leaflet dans Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Mapping des régions tunisiennes → coordonnées GPS
const regionCoordinates = {
  "ولاية تونس": [36.8065, 10.1815],
  "ولاية أريانة": [36.8665, 10.1647],
  "ولاية منوبة": [36.8990, 10.0993],
  "ولاية بن عروس": [36.7766, 10.2348],
  "ولاية صفاقس": [34.7406, 10.7603],
  "ولاية سوسة": [35.8256, 10.6084],
  "ولاية القيروان": [35.6781, 10.0963],
  "ولاية جندوبة": [36.5010, 8.7842],
  "ولاية باجة": [36.7250, 9.1825],
  "ولاية نابل": [36.4528, 10.7368],
  "ولاية المنستير": [35.7778, 10.8260],
  "ولاية المهدية": [35.5047, 11.0625],
  "ولاية القصرين": [35.1749, 8.8286],
  "ولاية قابس": [33.8815, 10.0993],
  "ولاية مدنين": [33.3549, 10.5051],
  "ولاية قبلي": [33.7011, 8.9681],
  "ولاية الكاف": [36.1656, 8.7062],
  "ولاية سيدي بوزيد": [35.0397, 9.5000],
  "ولاية قفصة": [34.4306, 8.7758],
  "ولاية تطاوين": [33.0000, 10.4500],
  "ولاية توزر": [33.9197, 8.1333],
  "ولاية سليانة": [36.0833, 9.3667],
};

const Dashboard = ({ onNavigate, onLogout, currentPage }) => {
  const [regionStats, setRegionStats] = useState([]);

  // Redirection si pas admin
  useEffect(() => {
    const userType = localStorage.getItem("typeUser");
    if (userType !== "admin") {
      onNavigate("profile");
      return;
    }
  }, [onNavigate]);

  // Récupération des stats depuis le backend
  useEffect(() => {
    const fetchRegionStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/region-stats`);
        setRegionStats(res.data);
      } catch (err) {
        console.error("Erreur récupération stats:", err);
      }
    };

    fetchRegionStats();
  }, []);

  // Centrer la carte sur la Tunisie
  const tunisiaCenter = [34.0, 9.0];
  const zoomLevel = 6;

  return (
    <div className="dashboard-container">
      <BackOfficeMenu onNavigate={onNavigate} onLogout={onLogout} currentPage={currentPage} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
          <p>Bienvenue sur le tableau de bord administrateur</p>
        </div>

        {/* Carte avec markers */}
        <div className="dashboard-map" style={{ height: "500px", marginBottom: "30px" }}>
          <MapContainer center={tunisiaCenter} zoom={zoomLevel} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {regionStats.map((loc, idx) => {
              const coords = regionCoordinates[loc._id];
              if (!coords) return null;
              return (
                <Marker key={idx} position={coords}>
                  <Popup>
                    {loc._id} - {loc.count} accès
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Tableau des stats */}
        <div className="dashboard-stats-table">
          <h2>Stats par région</h2>
          <table>
            <thead>
              <tr>
                <th>Région</th>
                <th>Nombre d'accès</th>
              </tr>
            </thead>
            <tbody>
              {regionStats.map((loc, idx) => (
                <tr key={idx}>
                  <td>{loc._id}</td>
                  <td>{loc.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
