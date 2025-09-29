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

    // Redirection si pas admin
    useEffect(() => {
        const userType = localStorage.getItem("typeUser");
        if (userType !== "admin") {
            onNavigate("profile");
            return;
        }
    }, [onNavigate]);

    
   
    return (
        <div className="dashboard-container">
            <BackOfficeMenu onNavigate={onNavigate} onLogout={onLogout} currentPage={currentPage} />

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Dashboard Admin</h1>
                    <p>Bienvenue sur le tableau de bord administrateur</p>
                </div>

             

              
            </div>
        </div>
    );
};

export default Dashboard;
