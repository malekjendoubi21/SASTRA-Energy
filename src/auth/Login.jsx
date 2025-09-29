import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css';
const API_URL = import.meta.env.VITE_API_URL; 

const Login = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    mail: '',
    mdp: '',
    age: '',
    numeroTelephone: '',
    adresse: '',
    region: '',
    ville: '',
    latitude: null,
    longitude: null,
    typeUser: 'user' // par défaut pour l'inscription
  });

  const [message, setMessage] = useState('');
  const [locationAvailable, setLocationAvailable] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, latitude, longitude }));
          setLocationAvailable(true);

          // Reverse geocoding pour remplir les champs d'adresse
          try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = response.data;
            const adresse = data.display_name;
            const region = data.address?.state || '';
            const ville = data.address?.city || data.address?.town || data.address?.village || '';
            setFormData(prev => ({ ...prev, adresse, region, ville }));
          } catch (error) {
            console.error('Erreur reverse geocoding:', error);
          }
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          setLocationAvailable(false);
          Swal.fire({
            icon: 'error',
            title: 'Localisation bloquée',
            text: 'Pour vous inscrire, vous devez autoriser l\'accès à votre position. Veuillez activer la géolocalisation dans les paramètres de votre navigateur.',
            confirmButtonText: 'OK'
          });
          setMessage('Localisation requise pour l\'inscription. Veuillez autoriser l\'accès à votre position.');
        }
      );
    } else {
      setLocationAvailable(false);
      Swal.fire({
        icon: 'error',
        title: 'Géolocalisation non supportée',
        text: 'Votre navigateur ne supporte pas la géolocalisation. Pour vous inscrire, un navigateur moderne avec géolocalisation est requis.',
        confirmButtonText: 'OK'
      });
      setMessage('Géolocalisation non supportée par ce navigateur.');
    }
  };

  useEffect(() => {
    if (mode === 'register') {
      getLocation();
    }
  }, [mode]);

  const handleToggle = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({
      nom: '',
      prenom: '',
      mail: '',
      mdp: '',
      age: '',
      numeroTelephone: '',
      adresse: '',
      region: '',
      ville: '',
      typeUser: 'user'
    });
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('API_URL:', API_URL); // Debug

  // Validation côté client pour l'inscription
  if (mode === 'register') {
    if (!locationAvailable) {
      Swal.fire({
        icon: 'error',
        title: 'Inscription impossible',
        text: 'La localisation est requise pour l\'inscription. Veuillez autoriser l\'accès à votre position dans les paramètres de votre navigateur.',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (!formData.nom || !formData.prenom || !formData.mail || !formData.mdp || !formData.numeroTelephone || !formData.latitude || !formData.longitude) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (formData.mdp.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.mail)) {
      setMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.numeroTelephone)) {
      setMessage('Veuillez entrer un numéro de téléphone valide.');
      return;
    }
  }

  // Validation pour la connexion
  if (mode === 'login') {
    if (!formData.mail || !formData.mdp) {
      setMessage('Veuillez entrer votre email et mot de passe.');
      return;
    }
  }

  try {
    if (mode === 'login') {
      const res = await axios.post(`${API_URL}/auth/login`, {
        mail: formData.mail,
        motDePasse: formData.mdp
      });
      localStorage.setItem('token', res.data.token);
      console.log('Login response:', res.data);
      if (res.data.typeUser) {
        localStorage.setItem('typeUser', res.data.typeUser);
        console.log('TypeUser stored:', res.data.typeUser);
      }
      setMessage('Connexion réussie !');
      if (onLoginSuccess) onLoginSuccess(res.data.typeUser || null);
      console.log('Login response data:', res.data); // Debug
    } else if (mode === 'register') {
      // Préparer les données pour l'inscription (seulement les champs remplis)
      const registerData = {
        nom: formData.nom,
        prenom: formData.prenom,
        mail: formData.mail,
        motDePasse: formData.mdp,
        numeroTelephone: formData.numeroTelephone,
        latitude: formData.latitude,
        longitude: formData.longitude,
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.adresse && { adresse: formData.adresse }),
        ...(formData.region && { region: formData.region }),
        ...(formData.ville && { ville: formData.ville }),
        typeUser: 'user'
      };

  //    console.log('Données d\'inscription nettoyées:', registerData); // Debug
      await axios.post(`${API_URL}/auth/register`, registerData);
      setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setMode('login');
    } else if (mode === 'forgot') {
      await axios.post(`${API_URL}/auth/forgot-password-code`, { mail: formData.mail });
      setMessage('Code de réinitialisation envoyé par email.');
    }
  } catch (err) {
    console.error('Erreur complète:', err); // Pour debug

    if (err.response) {
      // Erreur avec réponse du serveur
      const status = err.response.status;
      const errorMessage = err.response.data?.message;

      if (status === 400) {
        // Erreur de validation
        setMessage(errorMessage || 'Données invalides. Vérifiez vos informations.');
      } else if (status === 409) {
        // Conflit (email déjà existant)
        setMessage('Cet email est déjà utilisé. Veuillez en choisir un autre.');
      } else if (status === 500) {
        // Erreur serveur - essayer d'obtenir plus de détails
        const serverMessage = err.response.data?.error || err.response.data?.message;
        console.error('Erreur serveur détaillée:', err.response.data);
        setMessage(serverMessage || 'Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        setMessage(errorMessage || `Erreur ${status}. Veuillez réessayer.`);
      }
    } else if (err.request) {
      // Erreur réseau
      setMessage('Erreur de connexion. Vérifiez votre connexion internet.');
    } else {
      // Autre erreur
      setMessage('Une erreur inattendue s\'est produite.');
    }
  }
};

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>
          {mode === 'login' ? 'Connexion' : mode === 'register' ? 'Inscription' : 'Mot de passe oublié'}
        </h2>

        {message && (
          <div className={`message ${message.includes('succès') || message.includes('envoyé') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom *</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Âge</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" max="120" />
                </div>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input type="tel" name="numeroTelephone" value={formData.numeroTelephone} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Adresse</label>
                <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Région</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input type="text" name="ville" value={formData.ville} onChange={handleChange} />
                </div>
              </div>

              {/* Sélection type d'utilisateur supprimée, par défaut 'user' */}
            </>
          )}

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="mail" value={formData.mail} onChange={handleChange} required />
          </div>

          {(mode === 'login' || mode === 'register') && (
            <div className="form-group">
              <label>Mot de passe *</label>
              <input type="password" name="mdp" value={formData.mdp} onChange={handleChange} required minLength="6" />
              {mode === 'login' && (
                <div className="forgot-password">
                  <span className="forgot-link" onClick={() => setMode('forgot')}>Mot de passe oublié ?</span>
                </div>
              )}
            </div>
          )}

          {mode === 'register' && !locationAvailable && (
            <div className="location-warning">
              ⚠️ La localisation est requise pour l'inscription. Veuillez autoriser l'accès à votre position.
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={mode === 'register' && !locationAvailable}
          >
            {mode === 'login' ? 'Se connecter' : mode === 'register' ? "S'inscrire" : 'Envoyer le code'}
          </button>
        </form>

        <div className="toggle-section">
          {mode === 'forgot' ? (
            <p>
              <span className="toggle-link" onClick={() => setMode('login')}>Retour à la connexion</span>
            </p>
          ) : (
            <p>
              {mode === 'login' ? 'Pas de compte ? ' : 'Déjà un compte ? '}
              <span className="toggle-link" onClick={handleToggle}>{mode === 'login' ? 'Créer un compte' : 'Se connecter'}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
