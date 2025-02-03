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
                AND fecha = CURDATE()
                AND baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getOrders() {
        $sql = "SELECT p.id_pedido AS 'ID', u.nombre AS 'Nombre', u.apellido AS 'Apellido', u.telefono AS 'Teléfono', u.email AS 'Correo', p.fecha AS 'Fecha', p.hora AS 'Hora', p.estado AS 'Estado'
                FROM pedido p
                JOIN cliente c ON p.id_cliente = c.id_cliente
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE p.baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }




    function insertarPedido($jsonPedido) {
        $data = json_decode($jsonPedido, true);
    
        if (!$data) {
            return ['error' => 'JSON inválido'];
        }
    
        try {
            // Iniciar la transacción
            $this->conn->beginTransaction();
    
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
            $stmtPedido->bindValue(":id_direccion", $data['id_direccion'] ?? NULL, PDO::PARAM_INT);
            $stmtPedido->bindValue(":id_factura", $id_factura, PDO::PARAM_INT);
            $stmtPedido->execute();
            $id_pedido = $this->conn->lastInsertId();
    
            // Insertar productos y sus ingredientes
            foreach ($data['productos'] as $producto) {
                $id_producto = $producto['id'];
    
                foreach ($producto['ingredients'] as $ingrediente) {
                    $queryIngrediente = "INSERT INTO pedido_ingrediente (id_pedido, id_producto, id_ingrediente, precio, extra, cantidad) 
                                         VALUES (:id_pedido, :id_producto, :id_ingrediente, :precio, :extra, :cantidad)";
                    $stmtIngrediente = $this->conn->prepare($queryIngrediente);
                    $stmtIngrediente->bindValue(":id_pedido", $id_pedido, PDO::PARAM_INT);
                    $stmtIngrediente->bindValue(":id_producto", $id_producto, PDO::PARAM_INT);
                    $stmtIngrediente->bindValue(":id_ingrediente", $ingrediente['id_ingrediente'], PDO::PARAM_INT);
                    $stmtIngrediente->bindValue(":precio", $ingrediente['precio'], PDO::PARAM_STR);
                    $stmtIngrediente->bindValue(":extra", $ingrediente['extra'], PDO::PARAM_INT);
                    $stmtIngrediente->bindValue(":cantidad", $ingrediente['cantidad'], PDO::PARAM_INT);
                    $stmtIngrediente->execute();
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

}    