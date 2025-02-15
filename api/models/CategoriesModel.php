<?php
class Categories {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCat(){
        $sql = "SELECT id_categoria, nombre, imagen FROM categoria_producto
                WHERE baja=FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getRemovedCat(){
        $sql = "SELECT id_categoria, nombre, imagen FROM categoria_producto
                WHERE baja=TRUE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCatById($id = null) {
        // Construimos la base de la consulta
        $sql = "SELECT * FROM categoria_producto c 
                INNER JOIN producto_categoria pc 
                ON c.id_categoria = pc.id_categoria";
        
        // Si se pasa un id de producto, agregamos una cláusula WHERE
        if ($id !== null) {
            $sql .= " WHERE pc.id_producto = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);  // Asegúrate de que se pasa como un entero
            $stmt->execute();
            // Usamos fetchAll para obtener todas las categorías asociadas al producto
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            // Usamos fetchAll para obtener todas las categorías
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
    public function InsertCat($nombre, $imagen, $descripcion) {
        try {
            $uploadDir = 'uploads/';
            $imagePath = $uploadDir . basename($imagen['name']);

            if (!move_uploaded_file($imagen['tmp_name'], $imagePath)) {
                throw new Exception("Error al subir la imagen.");
            }

            $sql = "INSERT INTO categoria_producto (nombre, imagen, descripcion) VALUES (:nombre, :imagen, :descripcion)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':imagen', $imagePath);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (Exception $e) {
            throw new Exception("Error al insertar la categoria: " . $e->getMessage());
        }
    }

    public function UpdateCat($id_categoria, $nombre, $imagen, $descripcion) {
        $sql = "UPDATE categoria_producto SET nombre=:nombre, imagen=:imagen, descripcion=:descripcion WHERE id_categoria=:id_categoria";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_categoria', $id_categoria);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':imagen', $imagen);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new Exception("No se encontró la categoría");
        }else{
            return $stmt->rowCount();
        }
    }

    public function DeleteCat($id_categoria) {
        $sql = "UPDATE categoria_producto SET baja=TRUE WHERE id_categoria=:id_categoria";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_categoria', $id_categoria);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new Exception("No se encontró la categoría");
        }else{
            return $stmt->rowCount();
        }
    }


    public function ActivateCat ($id_categoria) {
        $sql = "UPDATE categoria_producto SET baja=FALSE WHERE id_categoria=:id_categoria";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_categoria', $id_categoria);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new Exception("No se encontró la categoría");
        }else{
            return $stmt->rowCount();
        }

    }





}
?>