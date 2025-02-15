import React, { useState, useEffect } from 'react';
import { CloseIcon, TrashIcon, UserCheckIcon } from '../../../img/HeroIcons';
import { postData } from '../apiService';
import './AdminReservations.css';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [filters, setFilters] = useState({
        fecha: '',
        hora: ''
    });
    const [dateValue, setDateValue] = useState('');

    useEffect(() => {
        fetchReservations();
        console.log('Filters:', filters);
    }, [filters]);

    const fetchReservations = async () => {
        try {
            postData('http://192.168.0.10:8080/api/getreservation', filters, setReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleCancelReservation = async () => {
        try {
            console.log('Selected reservation:', selectedReservation);
            if (!selectedReservation) return;
    
            // Convertir la fecha "DD/MM/YYYY" a "YYYY-MM-DD"
            const [day, month, year] = selectedReservation.Fecha.split('/');
            const formattedDate = `${year}-${month}-${day}`; // "2025-02-10"
    
            // Lógica para cancelar la reserva
            const response = await fetch('http://192.168.0.10:8080/api/cancelreservation', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id_mesa: selectedReservation['Nº Mesa'],
                    fecha: formattedDate, 
                    hora: selectedReservation.Hora,
                }),
            });
            
            const result = await response.json();
            console.log('Cancel reservation result:', result);
            if (result.success) {
                // Actualizar la lista de reservas
                await fetchReservations();
                setShowCancelModal(false);
                alert('Reserva cancelada exitosamente');
            } else {
                alert('Error al cancelar la reserva');
            }
        } catch (error) {
            console.error("Error al cancelar la reserva:", error);
            alert('Hubo un problema al cancelar la reserva');
        }
    };
    
    

    const clearFilters = () => {
        setFilters({
            fecha: '',
            hora: ''
        });
        setDateValue('');
        setSearchQuery('');
    };

    const formatDate = (date) => {
        setDateValue(date);
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleFilterChange = (e) => {

        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: name === 'fecha' ? formatDate(value) : value
        }));
    };

    const filterReservations = (reservations) => {
        return reservations.filter(reservation =>
            Object.values(reservation)
                .join(' ')
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    };

    const paginateReservations = (reservations, currentPage) => {
        const totalPages = Math.ceil(reservations.length / itemsPerPage);
        const currentData = reservations.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        return { currentData, totalPages };
    };

    const filteredReservations = filterReservations(reservations);
    const { currentData: currentReservations, totalPages } = paginateReservations(filteredReservations, currentPage);

    const handlePageChange = (direction) => {
        setCurrentPage(prev => 
            direction === 'prev' ? Math.max(prev - 1, 1) : Math.min(prev + 1, totalPages)
        );
    };

    return (
        <div className='reservations-format'>
            <div className='left'>
                <div className="reservations-tables">
                    <div className='admin-title reservations-title'>
                        <div>
                            <h2>RESERVAS</h2>
                        </div>
                        <div className="filter-container-reservations">
                            <input 
                                type="date" 
                                name="fecha"
                                onChange={handleFilterChange}
                                className="filter-input-reservations"
                                value={dateValue}
                            />
                            <input
                                type="time"
                                name="hora"
                                onChange={handleFilterChange}
                                className="filter-input-reservations"
                                value={filters.hora}
                            />
                            <input 
                                type="text" 
                                placeholder="Buscar reservas..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="search-bar" 
                            />
                                <button 
                                onClick={clearFilters}
                                className="admin-btn btn-delete-filters"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>
                    <div className='admin-table'>
                        <table>
                            <thead>
                                <tr>
                                    {currentReservations.length > 0 && 
                                        Object.keys(currentReservations[0]).map((key) => (
                                            <th key={key}>{key}</th>
                                        ))}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReservations.length > 0 ? (
                                    currentReservations.map((reservation, index) => (
                                        <tr key={index}>
                                            {Object.entries(reservation).map(([key, value], idx) => (
                                                <td key={idx}>{key === 'fecha' ? formatDate(value) : value}</td>
                                            ))}
                                            <td>
                                              
                                                <button 
                                                    className="admin-btn" 
                                                    onClick={() => {
                                                        setSelectedReservation(reservation);
                                                        setShowCancelModal(true);
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="100%" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                            No hay reservas para hoy
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
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
                </div>
            </div>

            {showCancelModal && (
                <div className="modal-overlay-reservations">
                    <div className="modal-content-reservations">
                        <h3>¿Confirmar cancelación de reserva?</h3>
                        <div className="modal-details-reservations">
                            {selectedReservation && (
                                <>
                                    <p><strong>Cliente:</strong> {selectedReservation.Cliente}</p>
                                    <p><strong>Fecha:</strong> {selectedReservation.Fecha}</p>
                                    <p><strong>Hora:</strong> {selectedReservation.Hora}</p>
                                    <p><strong>Mesa:</strong> {selectedReservation['Nº Mesa']}</p>
                                </>
                            )}
                        </div>
                        <div className="modal-actions-reservations">
                            <button 
                                className="modal-btn-reservations cancel-btn-reservations"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Volver
                            </button>
                            <button 
                                className="modal-btn-reservations cancel-btn-reservations"
                                onClick={handleCancelReservation}
                            >
                                Confirmar Cancelación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReservations;
