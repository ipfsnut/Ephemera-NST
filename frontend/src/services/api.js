import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const experimentService = {
  getAllExperiments: () => api.get('/api/experiments'),
  getExperimentById: (id) => api.get(`/api/experiments/${id}`),
  createExperiment: (data) => api.post('/api/experiments', data),
  updateExperiment: (id, data) => api.put(`/api/experiments/${id}`, data),
  deleteExperiment: (id) => api.delete(`/api/experiments/${id}`),
  exportExperimentData: (id) => api.get(`/api/experiments/${id}/export`, { responseType: 'blob' }),
  generateExperiment: (config) => api.post('/api/experiments/generate', config),
};

export const configService = {
  getConfig: () => api.get('/api/experiments/config'),
  updateConfig: (data) => api.post('/api/experiments/config', data),
};

export const trialService = {
  saveTrialResponse: (experimentId, data) => api.post(`/api/experiments/${experimentId}/responses`, data),
};

export { api };
