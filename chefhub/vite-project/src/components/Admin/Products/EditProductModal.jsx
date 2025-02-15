import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { EditIcon } from '../../../img/HeroIcons';
import './AddProductModal.css';


const EditProductModal = ({onProductUpdated, product }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
     const SetPreData = async () => {
         setName(product.Producto);
            setDescription(product.Descripción);
            setPrice(product.Precio);
            setImage(product.Imagen);         
        }
        SetPreData();
    }, [product]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientsRes, categoriesRes] = await Promise.all([
          fetch('http://chefhub.codefy.com:8080/api/ingredients/'),
          fetch('http://chefhub.codefy.com:8080/api/categories/')
        ]);
        
        if (!ingredientsRes.ok || !categoriesRes.ok) throw new Error('Error fetching data');
        
        const ingredients = await ingredientsRes.json();
        const categories = await categoriesRes.json();
        
        setAvailableIngredients(ingredients);
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos necesarios',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        });
      }
    };
    
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileName = `${file.name.split('.')[0]}.extension`;  // Aquí renombramos el archivo, puedes reemplazar 'extension' por el tipo que prefieras.
        setImage({
            ...file,
            name: fileName,  // Establecemos el nuevo nombre
        });
        setPreview(URL.createObjectURL(file));
    }
};

  const handleSelectIngredient = (ingredient, isAvailable) => {
    if (isAvailable) {
      setAvailableIngredients(prev => prev.filter(i => i.id_ingrediente !== ingredient.id_ingrediente));
      setSelectedIngredients(prev => [...prev, ingredient]);
    } else {
      setSelectedIngredients(prev => prev.filter(i => i.id_ingrediente !== ingredient.id_ingrediente));
      setAvailableIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleSelectCategory = (category, isAvailable) => {
    if (isAvailable) {
      setAvailableCategories(prev => prev.filter(c => c.id_categoria !== category.id_categoria));
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c.id_categoria !== category.id_categoria));
      setAvailableCategories(prev => [...prev, category]);
    }
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setName('');
    setDescription('');
    setPrice('');
    setSelectedIngredients([]);
    setSelectedCategories([]);
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    // Verificar si los campos obligatorios están completos
    if (!name || !description || !price || !image) {
      toast({
        title: 'Error',
        description: 'Complete todos los campos obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
        // Verificar si image es un objeto de tipo File
        if (image instanceof File) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;

                // Crear el objeto de datos a enviar en el formato adecuado
                const requestData = {
                    id_producto: product.ID,
                    nombre: name,
                    precio: price,
                    descripcion: description,
                    imagen: base64Image,  // La imagen ya está en base64
                    ingredientes: selectedIngredients.map(i => i.id_ingrediente),
                    categorias: selectedCategories.map(c => c.id_categoria),
                };

                // Enviar la solicitud PUT con los datos en formato JSON
                const response = await fetch('http://chefhub.codefy.com:8080/api/updateproduct', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',  // Asegurarnos de que el servidor entienda que es JSON
                    },
                    body: JSON.stringify(requestData),  // Convertimos el objeto a JSON
                });

                if (!response.ok) throw new Error('Error en la respuesta del servidor');

                const result = await response.json();

                toast({
                    title: 'Éxito',
                    description: `Producto modificado: ${name}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                });

                onProductUpdated();
                if (action === 'new') {
                    resetForm();
                } else {
                    onClose();
                }
            };

            reader.readAsDataURL(image);  // Convertir la imagen a base64
        } else {
            // Si no es un archivo válido, podemos enviar la solicitud sin imagen
            const requestData = {
                id_producto: product.ID,
                nombre: name,
                precio: price,
                descripcion: description,
                ingredientes: selectedIngredients.map(i => i.id_ingrediente),
                categorias: selectedCategories.map(c => c.id_categoria),
            };

            // Enviar la solicitud PUT con los datos en formato JSON
            const response = await fetch('http://chefhub.codefy.com:8080/api/updateproduct', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',  // Asegurarnos de que el servidor entienda que es JSON
                },
                body: JSON.stringify(requestData),  // Convertimos el objeto a JSON
            });

            if (!response.ok) throw new Error('Error en la respuesta del servidor');

            const result = await response.json();

            toast({
                title: 'Éxito',
                description: `Producto modificado: ${name}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });

            onProductUpdated();
            if (action === 'new') {
                resetForm();
            } else {
                onClose();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        toast({
            title: 'Error',
            description: 'Error al agregar el producto',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right'
        });
    }
};

  return (
    <>
      <button className="admin-btn" onClick={onOpen}>
        <EditIcon />
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent className="addproduct-modal">
          <ModalHeader className="addproduct-header">Editar Producto</ModalHeader>
          <ModalBody className="addproduct-body" overflowY="auto" maxH="70vh">
            <div className="addproduct-columns">
              <div className="addproduct-left">
                <div className="addproduct-field">
                  <label>Nombre *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className="addproduct-field">
                  <label>Descripción *</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del producto"
                    rows={4}
                  />
                </div>

                <div className="addproduct-field">
                  <label>Precio *</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Precio"
                  />
                </div>
                <div className="addproduct-field">
                  <label>Imagen *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="addproduct-input"
                  />
                  {preview && (
                    <div className="addproduct-preview">
                      <img src={preview} alt="Vista previa" />
                    </div>
                  )}
                </div>
              </div>

              <div className="addproduct-right">
                <div className="addproduct-field">
                  <h2>Ingredientes</h2>
                  <div className="addproduct-selection">
                    <div className="addproduct-box">
                      <label className='label-ingredients'>Disponibles</label>
                      <div className="addproduct-list">
                        {availableIngredients.map(ingredient => (
                          <div
                            key={ingredient.id_ingrediente}
                            className="addproduct-item"
                            onClick={() => handleSelectIngredient(ingredient, true)}
                          >
                            {ingredient.nombre}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="addproduct-box">
                      <label className='label-ingredients'>Seleccionados</label>
                      <div className="addproduct-list">
                        {selectedIngredients.map(ingredient => (
                          <div
                            key={ingredient.id_ingrediente}
                            className="addproduct-item"
                            onClick={() => handleSelectIngredient(ingredient, false)}
                          >
                            {ingredient.nombre}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="addproduct-field">
                  <h2>Categorías</h2>
                  <div className="addproduct-selection">
                    <div className="addproduct-box">
                      <label className='label-categories'>Disponibles</label>
                      <div className="addproduct-list">
                        {availableCategories.map(category => (
                          <div
                            key={category.id_categoria}
                            className="addproduct-item"
                            onClick={() => handleSelectCategory(category, true)}
                          >
                            {category.nombre}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="addproduct-box">
                      <label className='label-categories'>Seleccionadas</label>
                      <div className="addproduct-list">
                        {selectedCategories.map(category => (
                          <div
                            key={category.id_categoria}
                            className="addproduct-item"
                            onClick={() => handleSelectCategory(category, false)}
                          >
                            {category.nombre}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="addproduct-footer">
            <Button className="addproduct-cancel-btn" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="addproduct-submit-btn" onClick={(e) => handleSubmit(e, 'close')}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProductModal;