import React, { useState, useEffect, useContext } from 'react';
import { PendingOrdersIcon, TableIcon, CloseIcon, EyeIcon, UserCheckIcon} from '../../../img/HeroIcons';

import { fetchData } from '../apiService';
import './AdminOrders.css';
import { UserContext } from '../../../context/user';
const AdminOrders = () => {


    const { user } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [preparingData, setPreparingData] = useState([]);
    const [readyData, setReadyData] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [tableDetails, setTableDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    
    const [currentPagePending, setCurrentPagePending] = useState(1);
    const [currentPagePreparing, setCurrentPagePreparing] = useState(1);
    const [currentPageReady, setCurrentPageReady] = useState(1);
    const itemsPerPage = 5;



    const setOnPreparationOrder = async (id) => {
        try {
            const response = await fetch('http://localhost/api/updateorderstatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     id_pedido: id,
                     estado: 'En preparación',
                     ci: user.data.ci
                    }),
            });
            const result = await response.json();
            console.log(result);
            if (result.success) {
                alert('Pedido en preparación');
                fetchData('http://localhost/api/orders/pending', setData);
                fetchData('http://localhost/api/orders/preparation', setPreparingData);
            } else {
                alert('Error al cambiar el estado del pedido');
            }
        } catch (error) {
            console.error("Error al cambiar el estado del pedido:", error);
            alert('Hubo un problema al cambiar el estado del pedido');
        }
    };
    const setReadyOrder = async (id) => {
        try {
            const response = await fetch('http://localhost/api/updateorderstatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     id_pedido: id,
                     estado: 'Listo',
                     ci: user.data.ci
                    }),
            });
            const result = await response.json();
            console.log(result);
            if (result.success) {
                alert('Pedido Listo');
                
                fetchData('http://localhost/api/orders/preparation', setPreparingData);
                fetchData('http://localhost/api/orders/ready', setReadyData);
            } else {
                alert('Error al cambiar el estado del pedido');
            }
        } catch (error) {
            console.error("Error al cambiar el estado del pedido:", error);
            alert('Hubo un problema al cambiar el estado del pedido');
        }
    }

    const setDeliveredOrder = async (id) => {
        try {
            const response = await fetch('http://localhost/api/updateorderstatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     id_pedido: id,
                     estado: 'Entregado',
                     ci: user.data.ci
                    }),
            });
            const result = await response.json();
            console.log(result);
            if (result.success) {
                alert('Pedido Entregado');
                
                fetchData('http://localhost/api/orders/ready', setReadyData);
            } else {
                alert('Error al cambiar el estado del pedido');
            }
        } catch (error) {
            console.error("Error al cambiar el estado del pedido:", error);
            alert('Hubo un problema al cambiar el estado del pedido');
        }
    }
    useEffect(() => {
        fetchData('http://localhost/api/orders/pending', setData);
        fetchData('http://localhost/api/orders/preparation', setPreparingData);
        fetchData('http://localhost/api/orders/ready', setReadyData);
    }, []);

    const HandleShowIngredients = async (id_pedido, id_producto,$id_pedido_producto) => {
        try {
            const response = await fetch(`http://localhost/api/ingredientsperproduct/${id_pedido}/${id_producto}/${$id_pedido_producto}`);
            const data = await response.json();
            setIngredients(data);
        } catch (error) {
            console.error("Error al obtener ingredientes:", error);
            alert("Hubo un problema al obtener los ingredientes");
        }
    };
    
 


    const handleViewDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost/api/orders/detailorder/${id}`);
            const data = await response.json();
            setOrderDetails(data);
            
            console.log("Datos recibidos:", data); // Muestra los datos antes de actualizar el estado
            
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
            <div className='orders-format'>
                <div className='left'>
                    <div className="orders-tables">
                        <div className='admin-subtitle orders-title'>
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
                                                     <button
                                                        className="admin-btn"
                                                        onClick={() =>setOnPreparationOrder(item.ID)}
                                                    >
                                                        <UserCheckIcon />
                                                    </button>
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
                    </div>
                    <div className="orders-tables">
                        <div className='admin-subtitle'>
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
                                                <button
                                                        className="admin-btn"
                                                        onClick={() =>setReadyOrder(item.ID)}
                                                    >
                                                        <UserCheckIcon />
                                                    </button>
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
                    </div>
                    <div className="orders-tables">
                        <div className='admin-subtitle'>
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
                                                <button
                                                        className="admin-btn"
                                                        onClick={() =>setDeliveredOrder(item.ID)}
                                                    >
                                                        <UserCheckIcon />
                                                    </button>
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
                </div>

                <div className='right'>
                    <div className="orders-table details-section">
                        <div className='admin-subtitle'>
                            <h2>DETALLES DEL PEDIDO</h2>
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
                    <th>Nota</th>
                </>
            ) : (
                <th>Estado</th>
            )}
        </tr>
    </thead>
    <tbody>
        {orderDetails && orderDetails.length > 0 ? (
            orderDetails.map((order, index) => (
                <tr key={index}>
                    <td>{order.producto}</td>
                    <td>{order.cantidad}</td>
                    <td>{order.Nota}</td>
                    <td>
                    <button onClick={() => { 
    HandleShowIngredients(selectedOrder, order.id_producto ,order.id); 
}}>
    <EyeIcon />
</button>

                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="4">Seleccione un pedido para ver los detalles</td>
            </tr>
        )}
    </tbody>
</table>

                        </div>
                    </div>
                    <div className="orders-tables">
                    
                        <div className="admin-subtitle">
                            <h2>INGREDIENTES</h2>
                            </div>
                        <div className='admin-table'>
                        <table>
    <thead>
        <tr>
            {ingredients && ingredients.length > 0 ? (
                <>
                    <th>Ingrediente</th>
                    <th>Cantidad</th>
                </>
            ) : (
                <th>Estado</th>
            )}
        </tr>
    </thead>
    <tbody>
        {ingredients && ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
                <tr key={index}>
                    <td>{ingredient.Ingrediente}</td>
                    <td>{ingredient.Cantidad}</td>
                </tr>
            ))
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