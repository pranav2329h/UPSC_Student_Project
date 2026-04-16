import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const analyzeArticle = async (text: string, id: string) => {
  const response = await api.post('/api/analyze', { text, id });
  return response.data;
};

export const fetchNews = async (category = 'general') => {
  const response = await api.get(`/api/news?category=${category}`);
  return response.data;
};

export const retrieveAnalysis = async (id: string) => {
  const response = await api.get(`/api/analysis/${id}`);
  return response.data;
};

export default api;
