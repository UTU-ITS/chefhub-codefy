<?php
class Reservation {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCantReservation() {
        $sql = "SELECT COUNT(*) AS 'Cantidad'
                FROM cliente_mesa
                WHERE estado = 'Confirmada'
                AND fecha = CURRENT_DATE
                AND baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    Public function getReservation() {
        $sql = "SELECT *
                FROM cliente_mesa
                WHERE estado = 'Confirmada'
                AND fecha = CURRENT_DATE
                AND baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function cancelReservation ($id_usuario,$id_mesa, $fecha, $hora) {
        $sql = "UPDATE cliente_mesa
                SET estado = 'Cancelada'
                WHERE id_cliente = :id_mesa
                WHERE id_usuario = :id_usuario
                AND id_mesa = :id_mesa
                AND fecha = :fecha
                AND hora = :hora";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_mesa', $id_mesa);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->bindParam(':hora', $hora);
        $stmt->execute();
        return $stmt->rowCount();
    }

}



