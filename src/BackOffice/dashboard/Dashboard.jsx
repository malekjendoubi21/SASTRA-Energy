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

    // Centrer la carte sur le premier marker ou sur Tunis par défaut
    const mapCenter =
        regionStats.length > 0
            ? [regionStats[0].latitude, regionStats[0].longitude]
            : [36.8065, 10.1815];

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
                    <MapContainer center={mapCenter} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                      {regionStats.map((loc, idx) => {
  if (loc.latitude == null || loc.longitude == null) return null; // <-- ignore si coords null
  return (
    <Marker key={idx} position={[loc.latitude, loc.longitude]}>
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
