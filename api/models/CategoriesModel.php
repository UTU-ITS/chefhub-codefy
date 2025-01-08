<?php
class Categories {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCat(){
        $sql = "SELECT id_categoria, nombre FROM categoria_producto";
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
     }
?>