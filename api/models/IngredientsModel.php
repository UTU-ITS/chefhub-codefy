<?php
class Ingredients {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function GetIngredientsForProduct($id_producto) {
        $sql = "SELECT   i.precio,i.id_ingrediente, pi.id_producto, i.nombre, pi.cantidad, pi.extra FROM producto_ingrediente pi 
                INNER JOIN ingrediente i ON pi.id_ingrediente=i.id_ingrediente
                WHERE pi.id_producto=:id_producto AND pi.extra=true ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_producto', $id_producto);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }









}
?>

