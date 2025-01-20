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
        $sql = "SELECT id_producto AS 'ID', nombre AS 'Nombre', precio AS 'Precio', descripcion AS 'Descripción', imagen AS 'Imagen' FROM producto";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertProduct($nombre, $precio, $descripcion, $imagenFile) {
        try {
            $uploadDir = 'uploads/';
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
    
    public function insertProductIngredients($idProducto, $ingredientes) {
        try {
            // Verificar que se haya proporcionado un array de ingredientes
            if (empty($ingredientes) || !is_array($ingredientes)) {
                throw new Exception("El array de ingredientes es inválido o está vacío.");
            }
    
            // Construir la consulta SQL
            $sql = "INSERT INTO producto_ingrediente (id_producto, id_ingrediente) 
                    VALUES (:id_producto, :id_ingrediente)";
    
            // Preparar la sentencia
            $stmt = $this->conn->prepare($sql);
    
            // Iterar sobre los ingredientes y realizar la inserción
            foreach ($ingredientes as $idIngrediente) {
                $stmt->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
                $stmt->bindParam(':id_ingrediente', $idIngrediente, PDO::PARAM_INT);
                $stmt->execute();
            }
    
            return true; // Retornar true si todas las inserciones son exitosas
        } catch (PDOException $e) {
            throw new Exception("Error al insertar los ingredientes del producto: " . $e->getMessage());
        }
    }

    public function insertProductCategories($idProducto, $categorias) {
        try {
            // Verificar que se haya proporcionado un array de categorías
            if (empty($categorias) || !is_array($categorias)) {
                throw new Exception("El array de categorías es inválido o está vacío.");
            }

            // Construir la consulta SQL
            $sql = "INSERT INTO producto_categoria (id_producto, id_categoria) 
                    VALUES (:id_producto, :id_categoria)";

            // Preparar la sentencia
            $stmt = $this->conn->prepare($sql);

            // Iterar sobre las categorías y realizar la inserción
            foreach ($categorias as $idCategoria) {
                $stmt->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
                $stmt->bindParam(':id_categoria', $idCategoria, PDO::PARAM_INT);
                $stmt->execute();
            }

            return true; // Retornar true si todas las inserciones son exitosas

        } catch (PDOException $e) {
            throw new Exception("Error al insertar las categorías del producto: " . $e->getMessage());
        }

    }

    
    
    
}
