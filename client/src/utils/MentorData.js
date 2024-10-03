// src/utils/mentorUtils.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL

export const getMentors = async (token) => {
    try {
        // API call to fetch mentors
        const response = await axios.get(`${API_URL}mentors/getallmentors`,{
            headers: {
                "auth-token": token,
            },
        });
      
        if (response.data.success) {
            // Assuming 'mentors' is an array of mentor objects with a 'name' property
            const mentorNames = response.data.mentors.map(mentor => mentor.name);
            return mentorNames;
        } else {
            console.error('Failed to fetch mentors');
            return [];
        }
    } catch (error) {
        console.error('Error fetching mentors:', error);
        return [];
    }
};
export const getMentorsWithId = async (token) => {
    try {
        // API call to fetch mentors
        const response = await axios.get(`${API_URL}mentors/getallmentors`, {
            headers: {
                "auth-token": token,
            },
        });

        if (response.data.success) {
            // Assuming 'mentors' is an array of mentor objects with 'name' and '_id' properties
            const mentorData = response.data.mentors.map(mentor => ({
                name: mentor.name,
                _id: mentor._id,
            }));
            return mentorData;
        } else {
            console.error('Failed to fetch mentors');
            return [];
        }
    } catch (error) {
        console.error('Error fetching mentors:', error);
        return [];
    }
};