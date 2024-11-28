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

    public function insertProduct($nombre, $precio, $descripcion, $imagenFile) {
        try {
            $uploadDir = 'uploads/';  // Carpeta donde se guardarán las imágenes
            $imagePath = $uploadDir . basename($imagenFile['name']);
    
            // Mover el archivo subido a la carpeta de destino
            if (!move_uploaded_file($imagenFile['tmp_name'], $imagePath)) {
                throw new Exception("Error al subir la imagen.");
            }
    
            $sql = "INSERT INTO producto (nombre, precio, descripcion, imagen) 
                    VALUES (:nombre, :precio, :descripcion, :imagen)";
            $stmt = $this->conn->prepare($sql);
    
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':precio', $precio, PDO::PARAM_STR);
            $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
            $stmt->bindParam(':imagen', $imagePath, PDO::PARAM_STR);
    
            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error al insertar producto: " . $e->getMessage());
        }
    }
    
    
    
}
