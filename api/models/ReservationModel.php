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
}



