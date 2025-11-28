import axios from 'axios';
import { storage } from './storage';

export const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 10000,
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(async (config) => {
  try {
    const token = await storage.get<string>('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error adding token to request:', error);
  }
  return config;
});

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour vérifier la connexion API
export const isApiAvailable = async (): Promise<boolean> => {
  try {
    await api.get('/members');
    return true;
  } catch (error) {
    console.log('API non disponible, utilisation du stockage local');
    return false;
  }
};