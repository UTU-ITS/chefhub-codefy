<?php
class Table {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getTables() {
        $sql = "SELECT id_mesa AS 'N° Mesa', capacidad AS 'Capacidad', estado AS 'Estado' 
                FROM mesa
                WHERE baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}