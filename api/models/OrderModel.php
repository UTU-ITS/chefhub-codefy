<?php
class Order {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCantPendingOrders() {
        $sql = "SELECT COUNT(*) AS 'Cantidad'
                FROM pedido
                WHERE estado = 'Pendiente'
                AND fecha = CURDATE()
                AND baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getPendingOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', p.estado AS 'Estado', u.nombre AS 'Nombre', u.telefono AS 'Teléfono', p.fecha AS 'Fecha', p.hora AS 'Hora'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.estado = 'Pendiente' 
                AND p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getInPreparationOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', p.estado AS 'Estado', u.nombre AS 'Nombre', u.telefono AS 'Teléfono', p.fecha AS 'Fecha', p.hora AS 'Hora'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.estado = 'En preparación' 
                AND p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReadyOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', p.estado AS 'Estado', u.nombre AS 'Nombre', u.telefono AS 'Teléfono', p.fecha AS 'Fecha', p.hora AS 'Hora'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.estado = 'Listo' 
                AND p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDetailOrder($id_pedido) {
        $sql = "SELECT p.nombre AS producto, pp.cantidad
                FROM pedido_producto pp
                JOIN producto p ON pp.id_producto = p.id_producto
                WHERE pp.id_pedido = :id_pedido";   
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_pedido', $id_pedido);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}