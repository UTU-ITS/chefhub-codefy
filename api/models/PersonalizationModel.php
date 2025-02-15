<?php
class Personalization {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getColor() {
        $sql = "SELECT color FROM personalizacion;";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateColor($color) {
        $sql = "UPDATE personalizacion SET color = :color;";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':color', $color);
        $stmt->execute();
        return $stmt->rowCount();
    }
}