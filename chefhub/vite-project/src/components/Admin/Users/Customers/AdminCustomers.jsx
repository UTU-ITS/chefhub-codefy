import React, { useState, useEffect } from 'react';
import { NewIcon, EditIcon, ClearIcon, EyeIcon, CloseIcon2 } from '../../../../img/HeroIcons';
import { fetchData } from '../../apiService';

const AdminCustomers = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchData('http://localhost/api/customers', setData);
  }, []);

  const fetchAddress = async (id_cliente) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(`http://localhost/api/getadresses/${id_cliente}`);
      const data = await response.json();
      setAddressData(data);
    } catch (error) {
      console.error('Error al obtener las direcciones:', error);
    } finally {
      setLoadingAddress(false);
      setModalVisible(true);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const visibleColumns = currentData.length > 0
    ? Object.keys(currentData[0]).filter((key) => key !== 'id_cliente')
    : [];

  return (
    <div>
      <div className="admin-format">
        <div className="admin-title">
          <h2>CLIENTES</h2>
        </div>

        <div className="admin-options">
          <a className="admin-btn" href="customers/addcustomer">
            <NewIcon />Nuevo
          </a>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                {visibleColumns.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Direcciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id_cliente}>
                  {visibleColumns.map((key, idx) => (
                    <td key={idx}>
                      {key === 'Foto' ? (
                        <img
                          src={item[key]}
                          alt={`Foto de ${item.Nombre || 'cliente'}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        item[key]
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      className="admin-btn-view"
                      onClick={() => fetchAddress(item.id_cliente)}
                    >
                      <EyeIcon />
                    </button>
                  </td>
                  <td>
                    <button
                      className="admin-btn"
                      onClick={() => handleEdit(item.id_cliente)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="admin-btn"
                      onClick={() => handleDelete(item.id_cliente)}
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
          <div className="pagination">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className="admin-btn"
            >
              Anterior
            </button>
            <span>
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              className="admin-btn"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de direcciones */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className='modal-header'>
            <h3>Direcciones del cliente</h3>
            <a onClick={() => setModalVisible(false)}><CloseIcon2/></a>
            </div>
            {loadingAddress ? (
              <p>Cargando...</p>
            ) : addressData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Calle</th>
                    
                    <th>N° Puerta</th>
                    <th>Apto</th>
                    <th>Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {addressData.map((address, idx) => (
                    <tr key={idx}>
                      <td>{address.calle}</td>
                      
                      <td>{address.n_puerta}</td>
                      <td>{address.esquina}</td>
                      <td>{address.referencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se encontraron direcciones.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
