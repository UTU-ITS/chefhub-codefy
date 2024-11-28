import React, { useState } from 'react';
import './AddProduct.css';

export default function AddProduct() {
  // Estado para los campos del formulario
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Estado para la vista previa
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState(['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3', 'Ingrediente 4']);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [availableCategories, setAvailableCategories] = useState(['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4']);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Maneja la selección de una imagen y crea una vista previa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Actualiza la vista previa de la imagen
  };

  const handleSelectIngredient = (ingredient, isAvailable) => {
    if (isAvailable) {
      setAvailableIngredients(availableIngredients.filter(item => item !== ingredient));
      setSelectedIngredients([...selectedIngredients, ingredient]);
    } else {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
      setAvailableIngredients([...availableIngredients, ingredient]);
    }
  };

  const handleSelectCategory = (category, isAvailable) => {
    if (isAvailable) {
      setAvailableCategories(availableCategories.filter(item => item !== category));
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(item => item !== category));
      setAvailableCategories([...availableCategories, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', name);
    formData.append('precio', price);
    formData.append('descripcion', description);
    formData.append('imagen', image);
  
    try {
      const response = await fetch('http://localhost/api/insertproduct', {
        method: 'POST',
        body: formData
      });
  
      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
  
      const result = await response.json();
  
      if (result.message) {
        // Asumiendo que el mensaje de éxito siempre se recibe como "Producto insertado con éxito"
        alert(`Producto agregado con éxito con ID: ${result.product_id}`);
      } else {
        // Muestra el mensaje de error en caso de que no esté presente el "message"
        alert(`Error al agregar el producto: ${result.message || 'Mensaje no disponible'}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al agregar el producto.');
    }
  };
   

  return (
    <div className='add-product'>
      <h1>Nuevo Producto</h1>
      <form onSubmit={handleSubmit}>
        <div className='row-1'>
          <div className='col-1'>
            <div className='row row-image'>
              <div className='image-selector'>
                <label htmlFor='image'>Imagen</label>
                <input 
                  type='file' 
                  id='image' 
                  name='image' 
                  required 
                  onChange={handleImageChange} 
                />
              </div>
              <div className='image-preview'>
              {preview && (
                <img src={preview} alt="Vista previa" className="preview-image" />
              )}
              </div>
            </div>
            <div className='row'>
              <label htmlFor='name'>Nombre</label>
              <input 
                type='text' 
                id='name' 
                name='name' 
                value={name} 
                required 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className='row row-description'>
              <label htmlFor='description'>Descripción</label>
              <textarea 
                id='description' 
                name='description' 
                value={description} 
                required 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <div className='row price-input'>
              <label htmlFor='price'>Precio</label>
              <input 
                type='number' 
                id='price' 
                name='price' 
                value={price} 
                required 
                onChange={(e) => setPrice(e.target.value)} 
              />
            </div>
          </div>
          <div className='col-2'>
            <div className='row ingredients'>
              <label>Ingredientes extra</label>
              <div className="ingredient-box">
                <div className="box">
                  <div className="box-list">
                    <ul className='ingredient-list'>
                      {availableIngredients.map((ingredient, index) => (
                        <li key={index} onClick={() => handleSelectIngredient(ingredient, true)}>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Disponible(s)</strong></p>
                </div>
                <div className="box">
                  <div className="box-list">
                    <ul className="ingredient-list">
                      {selectedIngredients.map((ingredient, index) => (
                        <li key={index} onClick={() => handleSelectIngredient(ingredient, false)}>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Seleccionado(s)</strong></p>
                </div>
              </div>
            </div>
            {/* Categorías */}
            <div className='row categories'>
              <label>Categorías</label>
              <div className="category-box">
                <div className="box">
                  <div className="box-list">
                    <ul className="category-list">
                      {availableCategories.map((category, index) => (
                        <li key={index} onClick={() => handleSelectCategory(category, true)}>
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Disponible(s)</strong></p>
                </div>
                <div className="box">
                  <div className="box-list">
                    <ul className="category-list">
                      {selectedCategories.map((category, index) => (
                        <li key={index} onClick={() => handleSelectCategory(category, false)}>
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Seleccionado(s)</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row-2'>
          <button type='submit'>Agregar</button>
        </div>
      </form>
    </div>
  );
}
