import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirecciones
import './AddProduct.css';

export default function AddProduct() {
  const navigate = useNavigate(); // Hook para manejar la navegación
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost/api/ingredients/');
        if (!response.ok) throw new Error('Error al obtener los ingredientes');
        const data = await response.json();
        setAvailableIngredients(data);
      } catch (error) {
        console.error('Error al cargar los ingredientes:', error);
        alert('No se pudieron cargar los ingredientes disponibles.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/api/categories/');
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data = await response.json();
        setAvailableCategories(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        alert('No se pudieron cargar las categorías disponibles.');
      }
    };

    fetchIngredients();
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSelectIngredient = (ingredient, isAvailable) => {
    if (isAvailable) {
      setAvailableIngredients(availableIngredients.filter(item => item.id_ingrediente !== ingredient.id_ingrediente));
      setSelectedIngredients([...selectedIngredients, ingredient]);
    } else {
      setSelectedIngredients(selectedIngredients.filter(item => item.id_ingrediente !== ingredient.id_ingrediente));
      setAvailableIngredients([...availableIngredients, ingredient]);
    }
  };

  const handleSelectCategory = (category, isAvailable) => {
    if (isAvailable) {
      setAvailableCategories(availableCategories.filter(item => item.id_categoria !== category.id_categoria));
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(item => item.id_categoria !== category.id_categoria));
      setAvailableCategories([...availableCategories, category]);
    }
  };

  const handleSubmit = async (e, redirectTo) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', name);
    formData.append('precio', price);
    formData.append('descripcion', description);
    formData.append('imagen', image);

    selectedIngredients.forEach((ingredient) => {
      formData.append('ingredientes[]', ingredient.id_ingrediente);
    });
    selectedCategories.forEach((category) => {
      formData.append('categorias[]', category.id_categoria);
    });

    try {
      const response = await fetch('http://localhost/api/insertproduct', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error en la respuesta de la API');
      const result = await response.json();

      if (result.message) {
        alert(`Producto agregado con éxito con ID: ${result.product_id}`);
        if (redirectTo === 'products') {
          navigate('/admin/products');
        } else if (redirectTo === 'new') {
          window.location.reload(); // Recarga la página para un nuevo formulario
        }
      } else {
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
      <form>
        <div className='row-1'>
          <div className='col-1'>
            <div className='row row-image'>
              <label htmlFor='image'>Imagen</label>
              <input type='file' id='image' name='image' required onChange={handleImageChange} />
              <div className='image-preview'>
                {preview && <img src={preview} alt="Vista previa" className="preview-image" />}
              </div>
            </div>
            <div className='row row-name'>
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
            <div className='row row-price'>
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
                      {availableIngredients.map((ingredient) => (
                        <li
                          key={ingredient.id_ingrediente}
                          onClick={() => handleSelectIngredient(ingredient, true)}
                        >
                          {ingredient.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Disponible(s)</strong></p>
                </div>
                <div className="box">
                  <div className="box-list">
                    <ul className="ingredient-list">
                      {selectedIngredients.map((ingredient) => (
                        <li
                          key={ingredient.id_ingrediente}
                          onClick={() => handleSelectIngredient(ingredient, false)}
                        >
                          {ingredient.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Seleccionado(s)</strong></p>
                </div>
              </div>
            </div>
            <div className='row categories'>
              <label>Categorías</label>
              <div className="category-box">
                <div className="box">
                  <div className="box-list">
                    <ul className="category-list">
                      {availableCategories.map((category) => (
                        <li key={category.id_categoria} onClick={() => handleSelectCategory(category, true)}>
                          {category.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Disponible(s)</strong></p>
                </div>
                <div className="box">
                  <div className="box-list">
                    <ul className="category-list">
                      {selectedCategories.map((category) => (
                        <li key={category.id_categoria} onClick={() => handleSelectCategory(category, false)}>
                          {category.nombre}
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
          <button type="button" onClick={(e) => handleSubmit(e, 'products')}>Guardar</button>
          <button type="button" onClick={(e) => handleSubmit(e, 'new')} className='button-grey'>Guardar y añadir nuevo</button>
          <button type="button" onClick={() => navigate('/admin/products')} className='button-grey'>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
