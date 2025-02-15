<?php
class Product {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getProduct($id = null) {
        // Comienza la consulta común con el filtro de baja = FALSE
        $sql = "SELECT * FROM producto_categoria pc INNER JOIN producto p ON pc.id_producto = p.id_producto WHERE p.baja = FALSE";
        
        // Si se proporciona un id, agregamos la condición para filtrar por categoría
        if ($id !== null) {
            $sql .= " AND pc.id_categoria = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
        } else {
            // Si no se proporciona un id, ejecutamos la consulta sin el filtro por categoría
            $stmt = $this->conn->prepare($sql);
        }
        
        // Ejecutamos la consulta
        $stmt->execute();
        
        // Retornamos los resultados
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    

    
    public function getTableProducts() {
        $sql = "SELECT id_producto AS 'ID', nombre AS 'Producto', precio AS 'Precio', descripcion AS 'Descripción', imagen AS 'Imagen' 
        FROM producto
        WHERE baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getTableRemovedProducts() {
        $sql = "SELECT id_producto AS 'ID', nombre AS 'Producto', precio AS 'Precio', descripcion AS 'Descripción', imagen AS 'Imagen' 
        FROM producto
        WHERE baja = TRUE";
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
    public function DeleteProduct($id_producto){
        
            $sql = "UPDATE producto SET baja = TRUE WHERE id_producto = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id_producto);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        
    }

    public function ActivateProduct($id_producto){
        
        $sql = "UPDATE producto SET baja = FALSE WHERE id_producto = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id_producto);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }


    
}

public function updateProduct($idProducto, $nombre, $precio, $descripcion, $imagenFile, $ingredientes, $categorias) {
    try {
        // Si se ha proporcionado una nueva imagen, moverla al directorio de destino
        $imagePath = null;
        if ($imagenFile) {
            $uploadDir = 'uploads/';
            $imagePath = $uploadDir . basename($imagenFile['name']);
    
            if (!move_uploaded_file($imagenFile['tmp_name'], $imagePath)) {
                throw new Exception("Error al subir la imagen.");
            }
        }

        // Iniciar una transacción para asegurar que todas las actualizaciones se realicen correctamente
        $this->conn->beginTransaction();

        // 1. Actualizar la información del producto
        $sql = "UPDATE producto SET nombre = :nombre, precio = :precio, descripcion = :descripcion";
        if ($imagePath) {
            $sql .= ", imagen = :imagen";
        }
        $sql .= " WHERE id_producto = :id_producto";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':precio', $precio, PDO::PARAM_STR);
        $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
        if ($imagePath) {
            $stmt->bindParam(':imagen', $imagePath, PDO::PARAM_STR);
        }
        $stmt->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
        
        $stmt->execute();

        // 2. Eliminar los ingredientes anteriores del producto
        $sqlDeleteIngredients = "DELETE FROM producto_ingrediente WHERE id_producto = :id_producto";
        $stmtDeleteIngredients = $this->conn->prepare($sqlDeleteIngredients);
        $stmtDeleteIngredients->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
        $stmtDeleteIngredients->execute();

        // 3. Insertar los nuevos ingredientes
        if (!empty($ingredientes) && is_array($ingredientes)) {
            $sqlInsertIngredients = "INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES (:id_producto, :id_ingrediente)";
            $stmtInsertIngredients = $this->conn->prepare($sqlInsertIngredients);
            
            foreach ($ingredientes as $idIngrediente) {
                $stmtInsertIngredients->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
                $stmtInsertIngredients->bindParam(':id_ingrediente', $idIngrediente, PDO::PARAM_INT);
                $stmtInsertIngredients->execute();
            }
        }

        // 4. Eliminar las categorías anteriores del producto
        $sqlDeleteCategories = "DELETE FROM producto_categoria WHERE id_producto = :id_producto";
        $stmtDeleteCategories = $this->conn->prepare($sqlDeleteCategories);
        $stmtDeleteCategories->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
        $stmtDeleteCategories->execute();

        // 5. Insertar las nuevas categorías
        if (!empty($categorias) && is_array($categorias)) {
            $sqlInsertCategories = "INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (:id_producto, :id_categoria)";
            $stmtInsertCategories = $this->conn->prepare($sqlInsertCategories);
            
            foreach ($categorias as $idCategoria) {
                $stmtInsertCategories->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
                $stmtInsertCategories->bindParam(':id_categoria', $idCategoria, PDO::PARAM_INT);
                $stmtInsertCategories->execute();
            }
        }

        // Si todo fue exitoso, hacer commit de la transacción
        $this->conn->commit();

        return true; // Producto actualizado correctamente
    } catch (PDOException $e) {
        // Si ocurre un error, revertir la transacción
        $this->conn->rollBack();
        throw new Exception("Error al actualizar el producto: " . $e->getMessage());
    }
}

}
