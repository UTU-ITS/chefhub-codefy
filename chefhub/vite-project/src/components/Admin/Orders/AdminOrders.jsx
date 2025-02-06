import React, { useState, useEffect } from 'react';
import { PendingOrdersIcon, TableIcon, CloseIcon, EyeIcon } from '../../../img/HeroIcons';
import { fetchData } from '../apiService';
import './AdminOrders.css';

const AdminOrders = () => {
    const [data, setData] = useState([]);
    const [preparingData, setPreparingData] = useState([]);
    const [readyData, setReadyData] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [tableDetails, setTableDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false); // Controlar el modal de confirmación

    
    const [currentPagePending, setCurrentPagePending] = useState(1);
    const [currentPagePreparing, setCurrentPagePreparing] = useState(1);
    const [currentPageReady, setCurrentPageReady] = useState(1);

    const itemsPerPage = 5;

    useEffect(() => {
        fetchData('http://localhost/api/orders/pending', setData);
        fetchData('http://localhost/api/orders/preparation', setPreparingData);
        fetchData('http://localhost/api/orders/ready', setReadyData);
    }, []);

    const handleViewDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost/api/orders/detail/${id}`);
            const data = await response.json();
            setOrderDetails(data);
            setSelectedOrder(id);
        } catch (error) {
            console.error("Error al obtener detalles del pedido:", error);
        }
    };

    const handleTableOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost/api/tables/perorder/${id}`);
            const data = await response.json();
            setTableDetails(data.length > 0 ? data[0] : null);
        } catch (error) {
            console.error("Error al obtener detalles de la mesa:", error);
        }
    };

    const cancelOrder = async (id) => {
        try {
            const response = await fetch('http://localhost/api/cancelorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_pedido: id }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Pedido cancelado con éxito');
                // Resetear las tablas de datos después de cancelar
                fetchData('http://localhost/api/orders/pending', setData);
                fetchData('http://localhost/api/orders/preparation', setPreparingData);
                fetchData('http://localhost/api/orders/ready', setReadyData);
            } else {
                alert('Error al cancelar el pedido');
            }
            setShowCancelModal(false); // Cerrar el modal después de cancelar
        } catch (error) {
            console.error("Error al cancelar el pedido:", error);
            alert('Hubo un problema al cancelar el pedido');
            setShowCancelModal(false);
        }
    };

    const handleCancelClick = (id) => {
        setSelectedOrder(id);
        setShowCancelModal(true);
    };

    const filterOrders = (orders) => {
        return orders.filter((item) =>
            Object.values(item)
                .join(' ')
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    };

    const filteredPendingData = filterOrders(data);
    const filteredPreparingData = filterOrders(preparingData);
    const filteredReadyData = filterOrders(readyData);

    const paginateOrders = (orders, currentPage) => {
        const totalPages = Math.ceil(orders.length / itemsPerPage);
        const currentData = orders.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        return { currentData, totalPages };
    };

    const { currentData: currentPendingData, totalPages: totalPagesPending } = paginateOrders(filteredPendingData, currentPagePending);
    const { currentData: currentPreparingData, totalPages: totalPagesPreparing } = paginateOrders(filteredPreparingData, currentPagePreparing);
    const { currentData: currentReadyData, totalPages: totalPagesReady } = paginateOrders(filteredReadyData, currentPageReady);

    const handlePageChange = (type, direction) => {
        if (type === 'pending') {
            setCurrentPagePending((prev) =>
                direction === 'prev' ? Math.max(prev - 1, 1) : Math.min(prev + 1, totalPagesPending)
            );
        } else if (type === 'preparing') {
            setCurrentPagePreparing((prev) =>
                direction === 'prev' ? Math.max(prev - 1, 1) : Math.min(prev + 1, totalPagesPreparing)
            );
        } else if (type === 'ready') {
            setCurrentPageReady((prev) =>
                direction === 'prev' ? Math.max(prev - 1, 1) : Math.min(prev + 1, totalPagesReady)
            );
        }
    };

    return (
        <div>
            <div className='orders-format'>
                <div className='left'>

                    <div className='admin-title orders-title'>
                        <h2>PEDIDOS PENDIENTES</h2>
                        <input type="text" placeholder="Buscar pedidos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-bar" />
                    </div>
                    <div className='admin-table'>
                        <table>
                            <thead>
                                <tr>
                                    {currentPendingData.length > 0 
                                        ? Object.keys(currentPendingData[0]).map((key) => <th key={key}>{key}</th>) 
                                        : <th colSpan="100%">Estado</th>}
                                    {currentPendingData.length > 0 && <th>Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentPendingData.length > 0 ? (
                                    currentPendingData.map((item) => (
                                        <tr key={item.ID}>
                                            {Object.entries(item).map(([key, value], idx) => (
                                                <td key={idx}>{value}</td>
                                            ))}
                                            <td>
                                                <button className="admin-btn" onClick={() => handleCancelClick(item.ID)}>
                                                
                                                    <CloseIcon/>
                                                </button>
                                                <button className='admin-btn' onClick={() => handleViewDetails(item.ID) && handleTableOrder(item.ID)}>
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="100%" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                            No hay registros para visualizar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPagesPending > 1 && (
                        <div className='pagination'>
                            <button onClick={() => handlePageChange('pending', 'prev')} disabled={currentPagePending === 1} className='admin-btn'>
                                Anterior
                            </button>
                            <span>{currentPagePending} de {totalPagesPending}</span>
                            <button onClick={() => handlePageChange('pending', 'next')} disabled={currentPagePending === totalPagesPending} className='admin-btn'>
                                Siguiente
                            </button>
                        </div>
                    )}

                    <div className='admin-title orders-title'>
                        <h2>PEDIDOS EN PREPARACIÓN</h2>
                    </div>
                    <div className='admin-table'>
                        <table>
                            <thead>
                                <tr>
                                    {currentPreparingData.length > 0 
                                        ? Object.keys(currentPreparingData[0]).map((key) => <th key={key}>{key}</th>) 
                                        : <th colSpan="100%">Estado</th>}
                                    {currentPreparingData.length > 0 && <th>Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentPreparingData.length > 0 ? (
                                    currentPreparingData.map((item) => (
                                        <tr key={item.ID}>
                                            {Object.entries(item).map(([key, value], idx) => (
                                                <td key={idx}>{value}</td>
                                            ))}
                                            <td>
                                            <button className="admin-btn" onClick={() => handleCancelClick(item.ID)}>
                                            <CloseIcon />
                                                </button>
                                                <button className='admin-btn' onClick={() => handleViewDetails(item.ID)}>
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="100%" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                            No hay registros para visualizar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPagesPreparing > 1 && (
                        <div className='pagination'>
                            <button onClick={() => handlePageChange('preparing', 'prev')} disabled={currentPagePreparing === 1} className='admin-btn'>
                                Anterior
                            </button>
                            <span>{currentPagePreparing} de {totalPagesPreparing}</span>
                            <button onClick={() => handlePageChange('preparing', 'next')} disabled={currentPagePreparing === totalPagesPreparing} className='admin-btn'>
                                Siguiente
                            </button>
                        </div>
                    )}

                    {/* PEDIDOS LISTOS */}
                    <div className='admin-title orders-title'>
                        <h2>PEDIDOS LISTOS</h2>
                    </div>
                    <div className='admin-table'>
                        <table>
                            <thead>
                                <tr>
                                    {currentReadyData.length > 0 
                                        ? Object.keys(currentReadyData[0]).map((key) => <th key={key}>{key}</th>) 
                                        : <th colSpan="100%">Estado</th>}
                                    {currentReadyData.length > 0 && <th>Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentReadyData.length > 0 ? (
                                    currentReadyData.map((item) => (
                                        <tr key={item.ID}>
                                            {Object.entries(item).map(([key, value], idx) => (
                                                <td key={idx}>{value}</td>
                                            ))}
                                            <td>
                                            <button className="admin-btn" onClick={() => handleCancelClick(item.ID)}>
                                            <CloseIcon />
                                                </button>
                                                <button className='admin-btn' onClick={() => handleViewDetails(item.ID)}>
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="100%" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                            No hay registros para visualizar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPagesReady > 1 && (
                        <div className='pagination'>
                            <button onClick={() => handlePageChange('ready', 'prev')} disabled={currentPageReady === 1} className='admin-btn'>
                                Anterior
                            </button>
                            <span>{currentPageReady} de {totalPagesReady}</span>
                            <button onClick={() => handlePageChange('ready', 'next')} disabled={currentPageReady === totalPagesReady} className='admin-btn'>
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>

                <div className='right'>
                    <div className='admin-title orders-title'>
                        <div className='admin-title-right'>
                            <h2>DETALLES DEL PEDIDO</h2>
                        </div>
                    </div>
                    <div className='admin-details'>
                        <div className='details-item'>
                            <h4>Pedido</h4>
                            <PendingOrdersIcon/>
                         <p>{selectedOrder ? selectedOrder : 'Seleccione un pedido'}</p>
                        </div>
                        <div className='details-item'>
                            <h4>Mesa</h4><TableIcon/>
                            <p>{tableDetails ? tableDetails.id_mesa : 'N/A'}</p>

                        </div>
                        
                    </div> 
                    <div className='admin-table'>
                        <table>
                            <thead>
                                <tr>
                                    {orderDetails ? (
                                        <>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                        </>
                                    ) : (
                                        <th>Estado</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails ? (
                                    <tr>
                                        <td>{orderDetails.producto}</td>
                                        <td>{orderDetails.cantidad}</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="2">Seleccione un pedido para ver los detalles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className='admin-table'>
                        <h4>Ingredientes</h4>
                        <table>
                            <thead>
                                <tr>
                                    {orderDetails ? (
                                        <>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                        </>
                                    ) : (
                                        <th>Estado</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails ? (
                                    <tr>
                                        <td>{orderDetails.producto}</td>
                                        <td>{orderDetails.cantidad}</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="2">Seleccione un pedido para ver los detalles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
            {showCancelModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Está seguro de cancelar el pedido?</h3>
                        <button className="cancel-btn" onClick={() => setShowCancelModal(false)}>Cancelar</button>
                        <button className="confirm-btn" onClick={() => cancelOrder(selectedOrder)}>Confirmar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;