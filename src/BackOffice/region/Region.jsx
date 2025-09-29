import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BackOfficeMenu from "../components/BackOfficeMenu";
import "./Region.css";

// Fix icon par défaut Leaflet dans Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Region = ({ onNavigate, onLogout, currentPage }) => {
    const [regionStats, setRegionStats] = useState([]);
    const [countryStats, setCountryStats] = useState([]);
    const [regionsByCountry, setRegionsByCountry] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [regionPoints, setRegionPoints] = useState([]);
    const [sortFieldRegion, setSortFieldRegion] = useState('_id');
    const [sortOrderRegion, setSortOrderRegion] = useState('asc');
    const [sortFieldCountry, setSortFieldCountry] = useState('_id');
    const [sortOrderCountry, setSortOrderCountry] = useState('asc');
    const [sortFieldPoints, setSortFieldPoints] = useState('city');
    const [sortOrderPoints, setSortOrderPoints] = useState('asc');

    // Fonctions de tri
    const handleSortRegion = (field) => {
        const order = sortFieldRegion === field && sortOrderRegion === 'asc' ? 'desc' : 'asc';
        setSortFieldRegion(field);
        setSortOrderRegion(order);
    };

    const handleSortCountry = (field) => {
        const order = sortFieldCountry === field && sortOrderCountry === 'asc' ? 'desc' : 'asc';
        setSortFieldCountry(field);
        setSortOrderCountry(order);
    };

    const handleSortPoints = (field) => {
        const order = sortFieldPoints === field && sortOrderPoints === 'asc' ? 'desc' : 'asc';
        setSortFieldPoints(field);
        setSortOrderPoints(order);
    };

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

        const fetchCountryStats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/country-stats`);
                setCountryStats(res.data);
            } catch (err) {
                console.error("Erreur récupération stats pays:", err);
            }
        };

        fetchRegionStats();
        fetchCountryStats();
    }, []);

    // Gestionnaire de clic sur un marker de région
    const handleRegionClick = async (region) => {
        if (selectedRegion === region) {
            // Si la région est déjà sélectionnée, désélectionner
            setSelectedRegion(null);
            setRegionPoints([]);
        } else {
            // Charger tous les points de la région
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/region-points/${encodeURIComponent(region)}`);
                setSelectedRegion(region);
                setRegionPoints(res.data);
            } catch (err) {
                console.error("Erreur récupération points région:", err);
            }
        }
    };

    // Gestionnaire de clic sur un pays
    const handleCountryClick = async (country) => {
        if (selectedCountry === country) {
            // Désélectionner
            setSelectedCountry(null);
            setRegionsByCountry([]);
            setSelectedRegion(null);
            setRegionPoints([]);
        } else {
            // Charger les régions du pays
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/regions-by-country/${encodeURIComponent(country)}`);
                setSelectedCountry(country);
                setRegionsByCountry(res.data);
                setSelectedRegion(null);
                setRegionPoints([]);
            } catch (err) {
                console.error("Erreur récupération régions pays:", err);
            }
        }
    };

    // Centrer la carte sur le premier marker ou sur Tunis par défaut
    const mapCenter =
        regionStats.length > 0
            ? [regionStats[0].latitude, regionStats[0].longitude]
            : [36.8065, 10.1815];

    // Tri des données
    const sortedRegionStats = [...regionStats].sort((a, b) => {
        let aVal = a[sortFieldRegion];
        let bVal = b[sortFieldRegion];
        if (sortFieldRegion === 'count') {
            aVal = Number(aVal);
            bVal = Number(bVal);
        }
        if (aVal < bVal) return sortOrderRegion === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrderRegion === 'asc' ? 1 : -1;
        return 0;
    });

    const sortedCountryStats = [...countryStats].sort((a, b) => {
        let aVal = a[sortFieldCountry];
        let bVal = b[sortFieldCountry];
        if (sortFieldCountry === 'count') {
            aVal = Number(aVal);
            bVal = Number(bVal);
        }
        if (aVal < bVal) return sortOrderCountry === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrderCountry === 'asc' ? 1 : -1;
        return 0;
    });

    const sortedRegionsByCountry = [...regionsByCountry].sort((a, b) => {
        let aVal = a[sortFieldRegion];
        let bVal = b[sortFieldRegion];
        if (sortFieldRegion === 'count') {
            aVal = Number(aVal);
            bVal = Number(bVal);
        }
        if (aVal < bVal) return sortOrderRegion === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrderRegion === 'asc' ? 1 : -1;
        return 0;
    });

    // Fonction pour grouper les points par proximité de coordonnées
    const groupNearbyPoints = (points, threshold = 0.001) => {
        const grouped = [];
        const used = new Set();

        points.forEach((point, index) => {
            if (used.has(index)) return;

            const group = [point];
            used.add(index);

            // Trouver tous les points proches
            points.forEach((otherPoint, otherIndex) => {
                if (used.has(otherIndex)) return;

                const latDiff = Math.abs(point.latitude - otherPoint.latitude);
                const lngDiff = Math.abs(point.longitude - otherPoint.longitude);

                if (latDiff <= threshold && lngDiff <= threshold) {
                    group.push(otherPoint);
                    used.add(otherIndex);
                }
            });

            // Créer un point groupé
            const groupedPoint = {
                ...point,
                count: group.length,
                vpnDetecteds: group.map(p => p.vpnDetected),
                postalCodes: group.map(p => p.postalCode),
                referrers: group.map(p => p.referrer),
                dates: group.map(p => p.date)
            };

            grouped.push(groupedPoint);
        });

        return grouped;
    };

    // Grouper les points pour l'affichage
    const groupedRegionPoints = groupNearbyPoints(regionPoints);

    const sortedRegionPoints = [...groupedRegionPoints].sort((a, b) => {
        let aVal = a[sortFieldPoints];
        let bVal = b[sortFieldPoints];
        if (['latitude', 'longitude'].includes(sortFieldPoints)) {
            aVal = Number(aVal);
            bVal = Number(bVal);
        } else if (sortFieldPoints === 'date') {
            aVal = new Date(Math.max(...a.dates.map(d => new Date(d))));
            bVal = new Date(Math.max(...b.dates.map(d => new Date(d))));
        }
        if (aVal < bVal) return sortOrderPoints === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrderPoints === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="dashboard-container">
            <BackOfficeMenu onNavigate={onNavigate} onLogout={onLogout} currentPage={currentPage} />

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Dashboard Admin - Statistiques Régionales</h1>
                    <p>
                        {selectedRegion 
                            ? `Affichage détaillé des points d'accès pour la région: ${selectedRegion}`
                            : selectedCountry
                            ? `Régions du pays: ${selectedCountry}`
                            : "Cliquez sur un pays pour voir les régions, puis sur une région pour les détails"
                        }
                    </p>
                    {(selectedRegion || selectedCountry) && (
                        <button 
                            onClick={() => {
                                if (selectedRegion) {
                                    setSelectedRegion(null);
                                    setRegionPoints([]);
                                } else if (selectedCountry) {
                                    setSelectedCountry(null);
                                    setRegionsByCountry([]);
                                }
                            }}
                            style={{ 
                                marginTop: '10px', 
                                padding: '8px 16px', 
                                background: '#6c757d', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Retour
                        </button>
                    )}
                </div>

                {/* Carte avec markers */}
                <div className="dashboard-map" style={{ height: "500px", marginBottom: "30px" }}>
                    <MapContainer center={mapCenter} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {selectedRegion ? (
                            // Afficher tous les points groupés de la région sélectionnée
                            groupedRegionPoints.map((point, idx) => (
                                <Marker key={`point-${idx}`} position={[point.latitude, point.longitude]}>
                                    <Popup>
                                        Ville: {point.city}, Pays: {point.country} - {point.count} accès<br/>
                                        VPN: {point.vpnDetecteds.some(v => v) ? 'Détecté' : 'Non détecté'}<br/>
                                        Code Postal: {point.postalCodes.filter(pc => pc).join(', ')}<br/>
                                        Référent: {[...new Set(point.referrers)].join(', ')}<br/>
                                        Dernière visite: {new Date(Math.max(...point.dates.map(d => new Date(d)))).toLocaleString()}
                                    </Popup>
                                </Marker>
                            ))
                        ) : selectedCountry ? (
                            // Afficher un marker par région du pays sélectionné
                            regionsByCountry.map((loc, idx) => {
                                if (loc.latitude == null || loc.longitude == null) return null;
                                return (
                                    <Marker 
                                        key={`region-${idx}`} 
                                        position={[loc.latitude, loc.longitude]}
                                        eventHandlers={{
                                            click: () => handleRegionClick(loc._id)
                                        }}
                                    >
                                        <Popup>
                                            <div>
                                                <strong>{loc._id}</strong> - {loc.count} accès<br/>
                                                <button 
                                                    onClick={() => handleRegionClick(loc._id)}
                                                    style={{ 
                                                        marginTop: '5px', 
                                                        padding: '5px 10px', 
                                                        background: '#1e3a5f', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        borderRadius: '3px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Voir tous les points
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })
                        ) : (
                            // Afficher un marker par pays
                            countryStats.map((loc, idx) => {
                                if (loc.latitude == null || loc.longitude == null) return null;
                                return (
                                    <Marker 
                                        key={`country-${idx}`} 
                                        position={[loc.latitude, loc.longitude]}
                                        eventHandlers={{
                                            click: () => handleCountryClick(loc._id)
                                        }}
                                    >
                                        <Popup>
                                            <div>
                                                <strong>{loc._id}</strong> - {loc.count} accès<br/>
                                                <button 
                                                    onClick={() => handleCountryClick(loc._id)}
                                                    style={{ 
                                                        marginTop: '5px', 
                                                        padding: '5px 10px', 
                                                        background: '#1e3a5f', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        borderRadius: '3px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Voir les régions
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })
                        )}
                    </MapContainer>
                </div>

                {/* Tableaux des stats */}
                <div className="dashboard-stats-table">
                    <h2>Stats par pays</h2>
                    <table>
                        <thead>
                            <tr>
                                <th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSortCountry('_id')}
                                >
                                    Pays {sortFieldCountry === '_id' && (sortOrderCountry === 'asc' ? '↑' : '↓')}
                                </th>
                                <th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSortCountry('count')}
                                >
                                    Nombre d'accès {sortFieldCountry === 'count' && (sortOrderCountry === 'asc' ? '↑' : '↓')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCountryStats.map((loc, idx) => (
                                <tr key={idx}>
                                    <td 
                                        style={{ cursor: 'pointer', color: '#1e3a5f', textDecoration: 'underline' }}
                                        onClick={() => handleCountryClick(loc._id)}
                                    >
                                        {loc._id}
                                    </td>
                                    <td>{loc.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedCountry && (
                        <>
                            <h2>Régions de {selectedCountry}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSortRegion('_id')}
                                        >
                                            Région {sortFieldRegion === '_id' && (sortOrderRegion === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSortRegion('count')}
                                        >
                                            Nombre d'accès {sortFieldRegion === 'count' && (sortOrderRegion === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedRegionsByCountry.map((loc, idx) => (
                                        <tr key={idx}>
                                            <td 
                                                style={{ cursor: 'pointer', color: '#1e3a5f', textDecoration: 'underline' }}
                                                onClick={() => handleRegionClick(loc._id)}
                                            >
                                                {loc._id}
                                            </td>
                                            <td>{loc.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {selectedRegion && (
                        <div>
                            <h2>Points d'accès détaillés - {selectedRegion} ({groupedRegionPoints.length} points groupés)</h2>
                            <p>Détails des {groupedRegionPoints.length} points d'accès groupés par proximité :</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSortPoints('city')}
                                        >
                                            Ville {sortFieldPoints === 'city' && (sortOrderPoints === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSortPoints('country')}
                                        >
                                            Pays {sortFieldPoints === 'country' && (sortOrderPoints === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSortPoints('latitude')}
                                        >
                                            Latitude {sortFieldPoints === 'latitude' && (sortOrderPoints === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSortPoints('longitude')}
                                        >
                                            Longitude {sortFieldPoints === 'longitude' && (sortOrderPoints === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th>Nombre d'accès</th>
                                        <th>VPN Détecté</th>
                                        <th>Code Postal</th>
                                        <th>Référent</th>
                                        <th>Dernière visite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedRegionPoints.map((point, idx) => (
                                        <tr key={idx}>
                                            <td>{point.city}</td>
                                            <td>{point.country}</td>
                                            <td>{point.latitude}</td>
                                            <td>{point.longitude}</td>
                                            <td>{point.count}</td>
                                            <td>{point.vpnDetecteds.some(v => v) ? 'Oui' : 'Non'}</td>
                                            <td>{point.postalCodes.filter(pc => pc).join(', ')}</td>
                                            <td>{[...new Set(point.referrers)].join(', ')}</td>
                                            <td>{new Date(Math.max(...point.dates.map(d => new Date(d)))).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Region;
