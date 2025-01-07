<?php
class Ingredients {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function GetIngredients() {
        $sql = "SELECT id_ingrediente, nombre FROM ingrediente";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }    

    public function GetIngredientsForProduct($id_producto) {
        $sql = "SELECT   i.precio,i.id_ingrediente, pi.id_producto, i.nombre FROM producto_ingrediente pi 
                INNER JOIN ingrediente i ON pi.id_ingrediente=i.id_ingrediente
                WHERE pi.id_producto=:id_producto";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_producto', $id_producto);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>

