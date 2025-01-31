import React, { useState, useEffect } from 'react';
import { NewIcon, EditIcon, ClearIcon } from '../../../img/HeroIcons';
import { fetchData } from '../apiService';
import './AdminOrders.css';

const AdminOrders = () => {

    const [data, setData] = useState([]);
      const [searchQuery, setSearchQuery] = useState(''); // Estado para la barra de búsqueda
      const [currentPage, setCurrentPage] = useState(1); // Página actual
      const itemsPerPage = 12; // Registros por página
    
      useEffect(() => {
        fetchData('http://localhost/api/orders', setData);
      }, []);
    
      // Filtrar datos según la búsqueda
      const filteredData = data.filter((item) =>
        Object.values(item)
          .join(' ') // Combina todos los valores de un objeto en un string
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) // Aplica el filtro de búsqueda
      );
    
      // Calcular el número total de páginas
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
      // Obtener los datos de la página actual
      const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    
      // Cambiar de página
      const handlePageChange = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
}

    return(
        <div>
            <div className='admin-format'>
                <div className='admin-title'>
                <h2>PEDIDOS</h2>
                </div>

                <div className='admin-options'>
                <a className='admin-btn' href="products/addproduct">
                    <NewIcon />Nuevo
                </a>
                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                </div>

                <div className='admin-table orders-table' >
                <div className='left'>
                    <table>
                        <thead>
                        <tr>
                            {currentData.length > 0 &&
                            Object.keys(currentData[0]).map((key) => <th key={key}>{key}</th>)}
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id}>
                            {Object.entries(item)
                            .filter(([key]) => key !== "Imagen")
                            .map(([key, value], idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                            <td>
                                <button
                                className="admin-btn"
                                onClick={() => handleDelete(item.id)}
                                >
                                <ClearIcon />
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    {filteredData.length > itemsPerPage && (
                    <div className='pagination'>
                        <button
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 1}
                        className='admin-btn'
                        >
                        Anterior
                        </button>
                        <span>{currentPage} de {totalPages}</span>
                        <button
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage === totalPages}
                        className='admin-btn'
                        >
                        Siguiente
                        </button>
                    </div>
                    )}

                <div className='right'>
                    <table>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Producto 1</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Producto 2</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>Producto 3</td>
                            <td>3</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                </div>
                
                
            </div>
        </div>
    );
}

export default AdminOrders;