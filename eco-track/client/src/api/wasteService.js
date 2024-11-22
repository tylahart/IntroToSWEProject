import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const uploadWasteData = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/addWaste`, data);
        return response.data;
    } catch (error) {
        console.error("Error uploading waste data:", error);
        throw error;
    }
};