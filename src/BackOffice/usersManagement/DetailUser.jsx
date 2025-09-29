import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './DetailUser.css';

const DetailUser = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="detail-user-overlay" onClick={onClose}>
      <div className="detail-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detail-user-header">
          <h2>Détails de l'utilisateur</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="detail-user-content">
          <div className="user-info">
            <p><strong>Nom:</strong> {user.nom}</p>
            <p><strong>Prénom:</strong> {user.prenom}</p>
            <p><strong>Email:</strong> {user.mail}</p>
            <p><strong>Téléphone:</strong> {user.numeroTelephone}</p>
            <p><strong>Adresse:</strong> {user.adresse}</p>
            <p><strong>Région:</strong> {user.region}</p>
            <p><strong>Ville:</strong> {user.ville}</p>
            <p><strong>Latitude:</strong> {user.latitude}</p>
            <p><strong>Longitude:</strong> {user.longitude}</p>
            <p><strong>Type:</strong> {user.typeUser}</p>
          </div>
          <div className="user-map">
            {user.latitude && user.longitude ? (
              <MapContainer center={[user.latitude, user.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[user.latitude, user.longitude]}>
                  <Popup>
                    {user.nom} {user.prenom}<br />
                    {user.adresse}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Coordonnées non disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
