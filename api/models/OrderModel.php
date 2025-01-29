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

    public function getOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', u.nombre AS 'Nombre', u.apellido AS 'Apellido', u.telefono AS 'Teléfono', u.email AS 'Correo', p.fecha AS 'Fecha', p.hora AS 'Hora', p.estado AS 'Estado'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}