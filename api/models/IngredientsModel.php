<?php
class Ingredients {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function GetIngredients() {
        $sql = "SELECT id_ingrediente, nombre, precio FROM ingrediente
                WHERE baja=FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }    
    public function GetDeletedIngredients() {
        $sql = "SELECT id_ingrediente, nombre FROM ingrediente
                WHERE baja=TRUE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }  

    public function GetIngredientsForProduct($id_producto) {
        $sql = "SELECT   i.precio,i.id_ingrediente, pi.id_producto, i.nombre, pi.extra, pi.cantidad FROM producto_ingrediente pi 
                INNER JOIN ingrediente i ON pi.id_ingrediente=i.id_ingrediente
                WHERE pi.id_producto=:id_producto";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_producto', $id_producto);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function GetMostUsedIngredients() {
        $sql = "SELECT i.id_ingrediente, i.nombre, COUNT(pi.id_ingrediente) as cantidad FROM producto_ingrediente pi
                INNER JOIN ingrediente i ON pi.id_ingrediente=i.id_ingrediente
                GROUP BY pi.id_ingrediente
                ORDER BY cantidad DESC
                LIMIT 5";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);     
    }


    public function InsertIngredient($nombre, $precio) {
        $sql = "INSERT INTO ingrediente (nombre, precio) VALUES (:nombre, :precio)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':precio', $precio);
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    public function UpdateIngredient($id_ingrediente, $nombre, $precio) {
        $sql = "UPDATE ingrediente SET nombre=:nombre, precio=:precio WHERE id_ingrediente=:id_ingrediente";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_ingrediente', $id_ingrediente);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':precio', $precio);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new Exception("No se encontró el ingrediente");
        }else{
            return $stmt->rowCount();
        }
    }

    public function DeleteIngredient($id_ingrediente) {
        $sql = "UPDATE ingrediente SET baja=TRUE WHERE id_ingrediente=:id_ingrediente";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_ingrediente', $id_ingrediente);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new Exception("No se encontró el ingrediente");
        }else{
            return $stmt->rowCount();
        }
    }

    public function ActivateIngredient ($id_ingrediente) {
        $sql = "UPDATE ingrediente SET baja=FALSE WHERE id_ingrediente=:id_ingrediente";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_ingrediente', $id_ingrediente);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new Exception("No se encontró el ingrediente");
        }else{
            return $stmt->rowCount();
        }

    }


}
?>