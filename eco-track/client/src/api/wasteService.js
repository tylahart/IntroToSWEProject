import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const uploadWasteData = async (data) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No token found. User not authenticated.');
        }

        console.log('Token being sent:', token);

        const response = await axios.post(
            'http://localhost:8080/api/addWaste',
            data,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading waste data:', error.response?.data || error.message);
        throw error;
    }
};
