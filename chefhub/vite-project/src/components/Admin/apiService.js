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


/* por arreglar

// Update item using axios
  const updateData = async (item) => {
    try {
      const response = await axios.put(`http://localhost/api/products/${item.id}`, item);
      const updatedData = [...data];
      updatedData[editIndex] = response.data;
      setData(updatedData);
      setEditIndex(-1);
      setNewItem({});
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Delete item using axios
  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost/api/products/${id}`);
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      if (selectedItemId === id) {
        setSelectedItemId(null); // Desmarca si el seleccionado se elimina
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  */