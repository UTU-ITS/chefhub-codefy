import axios from 'axios';

export const fetchData = async (url, setData) => {
    try {
        const response = await axios.get(url);
        setData(response.data);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
};

export const postData = async (url, data, setData) => {
    try {
        const response = await axios.post(url, data);
        setData(response.data);
    } catch (error) {
        console.error(`Error posting data to ${url}:`, error);
    }
};

export const putData = async (url, data, setData) => {
    try {
        const response = await axios.put(url, data);
        setData(response.data);
    } catch (error) {
        console.error(`Error putting data to ${url}:`, error);
    }
};

export const deleteData = async (url, setData) => {
    try {
        const response = await axios.delete(url);
        setData(response.data);
    } catch (error) {
        console.error(`Error deleting data from ${url}:`, error);
    }
};