import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.example.com', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    }
});

export const fetchData = (endpoint) => {
    return apiClient.get(endpoint);
};

export const postData = (endpoint, data) => {
    return apiClient.post(endpoint, data);
};

export const updateData = (endpoint, data) => {
    return apiClient.put(endpoint, data);
};

export const deleteData = (endpoint) => {
    return apiClient.delete(endpoint);
};
