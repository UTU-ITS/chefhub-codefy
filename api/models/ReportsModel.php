<?php
class Reports {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getReport() {
        $sql = "SELECT table_name, column_name
                FROM information_schema.columns
                WHERE table_schema = 'chefhub_db'
                AND column_name NOT IN (
                    'id_categoria', 'id_categoria_padre', 'imagen', 'baja',
                    'id_cliente', 'id_usuario',
                    'id_mesa', 'fecha', 'hora', 'baja',
                    'id_preferencia',
                    'baja',
                    'id_direccion', 'apto', 'n_puerta', 'referencia', 'baja',
                    'baja',
                    'id_factura', 'estado', 'baja',
                    'id_auditoria', 'id_factura', 'fecha_modificacion', 'estado_anterior', 'estado_nuevo', 'baja',
                    'ci', 'fecha_nacimiento', 'direccion', 'horario_entrada', 'horario_salida', 'id_imagen', 'baja',
                    'id_imagen', 'tipo', 'ruta', 'baja',
                    'id_ingrediente', 'precio', 'stock', 'baja',
                    'capacidad', 'baja',
                    'id_pedido', 'id_mesa', 'hora_inicio', 'hora_fin', 'baja',
                    'id_pago', 'id_factura', 'baja',
                    'id_auditoria', 'id_pago', 'fecha_modificacion', 'monto_anterior', 'monto_nuevo', 'baja',
                    'id_pedido', 'subtotal', 'categoria', 'id_cliente', 'id_direccion', 'id_factura', 'baja',
                    'id_auditoria', 'id_pedido', 'fecha_modificacion', 'estado_anterior', 'estado_nuevo', 'baja',
                    'id_pedido_producto', 'id_ingrediente',
                    'id_pedido_producto', 'id_pedido', 'id_producto', 'importe', 'nota', 'baja',
                    'zona_horaria', 'moneda', 'baja',
                    'id_preferencia', 'alimentaria', 'dietetica', 'id_categoria', 'baja',
                    'id_producto', 'precio', 'descripcion', 'imagen', 'baja',
                    'id_producto', 'id_categoria', 'baja',
                    'id_producto', 'id_ingrediente', 'cantidad', 'extra', 'baja',
                    'id_telefono', 'nombre_rest', 'baja',
                    'id_token', 'email', 'token', 'fecha_creacion', 'baja',
                    'id_usuario', 'clave', 'fecha_creacion', 'fecha_modif', 'baja'
                );";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }
}