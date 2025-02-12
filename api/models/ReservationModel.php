<?php
class Reservation {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCantReservation() {
        $sql = "SELECT COUNT(*) AS 'Cantidad'
                FROM cliente_mesa
                WHERE estado = 'Confirmada'
                AND fecha = CURRENT_DATE
                AND baja = FALSE";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getReservation($fecha = null, $hora = null) {
        $sql = "SELECT CONCAT(u.nombre, ' ', u.apellido) AS 'Cliente', 
                       cm.nombre_reserva AS 'A nombre de', 
                       cm.tel_contacto AS 'Teléfono', 
                       cm.id_mesa AS 'Nº Mesa', 
                       DATE_FORMAT(cm.fecha, '%d/%m/%Y') AS 'Fecha', 
                       cm.hora AS 'Hora'
                FROM cliente_mesa cm
                JOIN cliente c ON c.id_cliente = cm.id_cliente
                JOIN usuario u ON u.id_usuario = c.id_usuario
                WHERE cm.estado = 'Reservada'
                AND cm.baja = FALSE";
    
        $params = [];
    
        if ($fecha) {
            $sql .= " AND cm.fecha = STR_TO_DATE(:fecha, '%d/%m/%Y')";
            $params[':fecha'] = $fecha;
        } else {
            $sql .= " AND cm.fecha = CURRENT_DATE";
        }
    
        if ($hora) {
            $sql .= " AND cm.hora = :hora";
            $params[':hora'] = $hora;
        }
    
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
        

    public function cancelReservation ($id_usuario,$id_mesa, $fecha, $hora) {
        $sql = "UPDATE cliente_mesa
                SET estado = 'Cancelada'
                WHERE id_cliente = :id_mesa
                WHERE id_usuario = :id_usuario
                AND id_mesa = :id_mesa
                AND fecha = :fecha
                AND hora = :hora";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_mesa', $id_mesa);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->bindParam(':hora', $hora);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function getMyReservations ($id_cliente){
        $sql = "SELECT cm.id_mesa , 
                       cm.fecha , 
                       cm.hora , 
                       cm.cant_personas , 
                       cm.nombre_reserva, 
                       cm.tel_contacto, 
                       cm.estado
                FROM cliente_mesa cm
                WHERE cm.id_cliente = :id_cliente
                AND cm.baja = FALSE
                ORDER BY cm.fecha DESC, cm.hora DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);




    }
}



