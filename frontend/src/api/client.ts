import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const intakeApi = {
    create: (data: any) => api.post('/intake/', data),
    get: (id: string) => api.get(`/intake/${id}`),
    list: () => api.get('/intake/'),
};

export const reviewApi = {
    listPending: () => api.get('/review/pending'),
    createTask: (data: any) => api.post('/review/', data),
    updateTask: (id: string, data: any) => api.put(`/review/${id}`, data),
};

export const scoringApi = {
    compute: (requestId: string) => api.post(`/scoring/${requestId}/compute`),
    get: (requestId: string) => api.get(`/scoring/${requestId}`),
};

export const aiApi = {
    checkMissing: (fields: string[]) => api.post('/ai/check-missing-fields', { fields_present: fields }),
    generateSummary: (description: string) => api.post('/ai/generate-summary', null, { params: { description } }),
};

export default api;
