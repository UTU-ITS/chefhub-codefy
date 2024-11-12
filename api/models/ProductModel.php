<?php
class Product {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }


    public function getProduct($id = null) {
        $sql = "SELECT * FROM producto_categoria pc INNER JOIN producto p ON pc.id_producto = p.id_producto";
        if ($id !== null) {
            $sql .= " WHERE pc.id_categoria = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function getTableProducts() {
        $sql = "SELECT * FROM producto";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertProduct($data) {
        $sql = "INSERT INTO producto (nombre, precio, descripcion, imagen) VALUES (:nombre, :precio, :descripcion, :imagen)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':precio', $data['precio']);
        $stmt->bindParam(':descripcion', $data['descripcion']);
        $stmt->bindParam(':imagen', $data['imagen']);
        $stmt->execute();
        return $this->conn->lastInsertId();
    }
}
?>