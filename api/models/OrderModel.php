<?php
class Order {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCantPendingOrders() {
        $sql = "SELECT COUNT(*) AS 'Cantidad'
                FROM pedido
                WHERE estado = 'Pendiente'
                AND baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function insertarPedido($jsonPedido) {
        $data = json_decode($jsonPedido, true);
    
        if (!$data) {
            return ['error' => 'JSON inválido'];
        }
    
        try {
            // Iniciar la transacción
            $this->conn->beginTransaction();
    
            // Validar si id_mesa está presente y asignar categoría "Mesa"
            if (isset($data['id_mesa']) && empty($data['categoria'])) {
                $data['categoria'] = 'Mesa'; // Asignamos automáticamente la categoría si id_mesa está presente
            }
    
            // Si la categoría es "Mesa", asegurarse de que id_mesa esté presente
            if ($data['categoria'] === "Mesa" && !isset($data['id_mesa'])) {
                throw new Exception("El campo 'id_mesa' es requerido para pedidos de tipo 'Mesa'.");
            }
    
            // Insertar en factura
            $queryFactura = "INSERT INTO factura (total, estado) VALUES (:total, 'Pendiente')";
            $stmtFactura = $this->conn->prepare($queryFactura);
            $stmtFactura->bindValue(":total", $data['total'], PDO::PARAM_STR);
            $stmtFactura->execute();
            $id_factura = $this->conn->lastInsertId();
    
            // Insertar en pedido
            $queryPedido = "INSERT INTO pedido (subtotal, estado, categoria, id_cliente, id_direccion, id_factura) 
                            VALUES (:subtotal, :estado, :categoria, :id_cliente, :id_direccion, :id_factura)";
            $stmtPedido = $this->conn->prepare($queryPedido);
            $stmtPedido->bindValue(":subtotal", $data['total'], PDO::PARAM_STR);
            $stmtPedido->bindValue(":estado", $data['estado'], PDO::PARAM_STR);
            $stmtPedido->bindValue(":categoria", $data['categoria'], PDO::PARAM_STR);
            $stmtPedido->bindValue(":id_cliente", $data['id_cliente'], PDO::PARAM_INT);
    
            if (isset($data['id_direccion'])) {
                $stmtPedido->bindValue(":id_direccion", $data['id_direccion'], PDO::PARAM_INT);
            } else {
                $stmtPedido->bindValue(":id_direccion", null, PDO::PARAM_NULL);
            }
    
            $stmtPedido->bindValue(":id_factura", $id_factura, PDO::PARAM_INT);
            $stmtPedido->execute();
            $id_pedido = $this->conn->lastInsertId();
    
            // Insertar en pedido_mesa si es necesario
            if ($data['categoria'] === "Mesa" && isset($data['id_mesa'])) {
                $this->insertTableOrder($data['id_mesa'], $id_pedido);
            }
    
            // Insertar productos en pedido_producto
            if (!empty($data['productos']) && is_array($data['productos'])) {
                foreach ($data['productos'] as $producto) {
                    $queryProducto = "INSERT INTO pedido_producto (id_pedido, id_producto, cantidad, importe, nota) 
                                     VALUES (:id_pedido, :id_producto, :cantidad, :importe, :nota)";
                    $stmtProducto = $this->conn->prepare($queryProducto);
                    $stmtProducto->bindValue(":id_pedido", $id_pedido, PDO::PARAM_INT);
                    $stmtProducto->bindValue(":id_producto", $producto['id'], PDO::PARAM_INT);
                    $stmtProducto->bindValue(":cantidad", 1, PDO::PARAM_INT);
                    $stmtProducto->bindValue(":importe", $producto['price'], PDO::PARAM_STR);
                    $stmtProducto->bindValue(":nota", $producto['note'] ?? null, PDO::PARAM_STR);
                    $stmtProducto->execute();
                    $id_pedido_producto = $this->conn->lastInsertId();
    
                    // Insertar ingredientes si existen
                    if (!empty($producto['ingredients']) && is_array($producto['ingredients'])) {
                        foreach ($producto['ingredients'] as $ingrediente) {
                            $queryIngrediente = "INSERT INTO pedido_ingrediente (id_pedido_producto, id_ingrediente, cantidad) 
                                                 VALUES (:id_pedido_producto, :id_ingrediente, :cantidad)";
                            $stmtIngrediente = $this->conn->prepare($queryIngrediente);
                            $stmtIngrediente->bindValue(":id_pedido_producto", $id_pedido_producto, PDO::PARAM_INT);
                            $stmtIngrediente->bindValue(":id_ingrediente", $ingrediente['id_ingrediente'], PDO::PARAM_INT);
                            $stmtIngrediente->bindValue(":cantidad", $ingrediente['cantidad'], PDO::PARAM_INT);
                            $stmtIngrediente->execute();
                        }
                    }
                }
            }
    
            // Confirmar la transacción
            $this->conn->commit();
    
            return ['success' => 'Pedido insertado correctamente', 'id_pedido' => $id_pedido];
    
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['error' => 'Error al insertar pedido: ' . $e->getMessage()];
        }
    }
    
    
    // ✅ Función corregida para insertar en pedido_mesa con fecha y hora
    public function insertTableOrder($id_mesa, $id_pedido) {
        $sql = "INSERT INTO mesa_pedido (id_pedido, id_mesa, fecha, hora_inicio, hora_fin) 
                VALUES (:id_pedido, :id_mesa, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR))";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_pedido', $id_pedido, PDO::PARAM_INT);
        $stmt->bindParam(':id_mesa', $id_mesa, PDO::PARAM_INT);
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            return ['success' => 'Pedido insertado correctamente en pedido_mesa'];
        } else {
            throw new Exception('Error al insertar pedido en pedido_mesa');
        }
    }
    
    

    public function getPendingOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', p.estado AS 'Estado', u.nombre AS 'Nombre', u.telefono AS 'Teléfono', p.fecha_hora AS 'Fecha', p.categoria AS 'Categoría'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.estado = 'Pendiente' 
                AND p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getInPreparationOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', p.estado AS 'Estado', u.nombre AS 'Nombre', u.telefono AS 'Teléfono', p.fecha_hora AS 'Fecha'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.estado = 'En preparación' 
                AND p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReadyOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', p.estado AS 'Estado', u.nombre AS 'Nombre', u.telefono AS 'Teléfono', p.fecha_hora AS 'Fecha'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.estado = 'Listo' 
                AND p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDetailOrder($id_pedido) {
        $sql = "SELECT p.nombre AS producto, pp.cantidad
                FROM pedido_producto pp
                JOIN producto p ON pp.id_producto = p.id_producto
                WHERE pp.id_pedido = :id_pedido
                GROUP BY pp.id_producto";   
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_pedido', $id_pedido);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getIngredientsPerProductInOrder($id_pedido, $id_producto) {
        $sql = "SELECT i.nombre AS 'Ingrediente', pi.cantidad AS 'Cantidad'
                FROM pedido_ingrediente pi
                JOIN ingrediente i ON pi.id_ingrediente = i.id_ingrediente
                WHERE pi.id_pedido = :id_pedido
                AND pi.id_producto = :id_producto";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_pedido', $id_pedido);
        $stmt->bindParam(':id_producto', $id_producto);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function CancelOrder($id_pedido) {
        $sql = "UPDATE pedido SET estado = 'Cancelado' WHERE id_pedido = :id_pedido";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_pedido', $id_pedido);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ['success' => 'Pedido cancelado correctamente'];
        } else {
            return false;
        }
    }

        
    
    


}