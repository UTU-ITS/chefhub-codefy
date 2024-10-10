<?php
class Product {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }


    public function getProduct($id = null) {
        $sql = "SELECT * FROM product";
        if ($id !== null) {
            $sql .= " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
}
?>