import React, { useState, useEffect } from 'react';
import { NewIcon, EditIcon, ClearIcon, EyeIcon, CloseIcon2 } from '../../../img/HeroIcons';
import { fetchData } from '../apiService';
import AddTableModal from './AddTableModal';

const AdminTables = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchData('http://chefhub.codefy.com:8080/api/tables', setData);
  }, []);

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
          <h2>MESAS</h2>
        </div>

        <div className="admin-options">
        <AddTableModal onTableAdded={() => fetchData('http://chefhub.codefy.com:8080/api/tables', setData)} />
          <input
            type="text"
            placeholder="Buscar mesas..."
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
    </div>
  );
};

export default AdminTables;
