<?php
class TablesModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getFreeHours($date)
    {
        $sql = "
            WITH horarios_disponibles AS (
                SELECT horario_apertura, horario_cierre, duracion_reserva
                FROM dia_horario
                WHERE dia_semana = CASE 
                    WHEN DAYNAME(:date) = 'Monday' THEN 'Monday'
                    WHEN DAYNAME(:date) = 'Tuesday' THEN 'Tuesday'
                    WHEN DAYNAME(:date) = 'Wednesday' THEN 'Wednesday'
                    WHEN DAYNAME(:date) = 'Thursday' THEN 'Thursday'
                    WHEN DAYNAME(:date) = 'Friday' THEN 'Friday'
                    WHEN DAYNAME(:date) = 'Saturday' THEN 'Saturday'
                    WHEN DAYNAME(:date) = 'Sunday' THEN 'Sunday'
                END
            ),
            posibles_horas AS (
                SELECT 
                    ADDTIME(hd.horario_apertura, SEC_TO_TIME(t.n * TIME_TO_SEC(hd.duracion_reserva))) AS hora
                FROM horarios_disponibles hd
                JOIN (
                    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                ) t
                WHERE ADDTIME(hd.horario_apertura, SEC_TO_TIME(t.n * TIME_TO_SEC(hd.duracion_reserva))) <= hd.horario_cierre
            )
            SELECT * FROM posibles_horas;
        ";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    
    
    public function getFreeTables($date, $time)
{
    $sql = "
        SELECT m.id_mesa, m.capacidad 
        FROM mesa m
        LEFT JOIN cliente_mesa cm
            ON cm.id_mesa = m.id_mesa
            AND cm.fecha = :date
            AND DATE_FORMAT(cm.hora, '%H:%i') = :time
            AND cm.baja = 0
        WHERE cm.id_mesa IS NULL;
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':date', $date, PDO::PARAM_STR);
    $stmt->bindParam(':time', $time, PDO::PARAM_STR);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



public function InsertReservations($id_mesa, $id_cliente, $fecha, $hora , $cant_personas, $nombre_reserva, $tel_contacto)
{
    $sql = "INSERT INTO cliente_mesa (id_mesa, id_cliente, fecha, hora, cant_personas , nombre_reserva, tel_contacto, estado)
     VALUES (:id_mesa, :id_cliente, :fecha, :hora,:cant_personas , :nombre_reserva  ,:tel_contacto, 'RESERVADO')";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_mesa', $id_mesa, PDO::PARAM_INT);
    $stmt->bindParam(':id_cliente', $id_cliente, PDO::PARAM_INT);
    $stmt->bindParam(':nombre_reserva', $nombre_reserva, PDO::PARAM_STR);
    $stmt->bindParam(':cant_personas', $cant_personas, PDO::PARAM_INT);
    $stmt->bindParam(':tel_contacto', $tel_contacto, PDO::PARAM_INT);
    $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    $stmt->bindParam(':hora', $hora, PDO::PARAM_STR);
    $stmt->execute();
    
    return $stmt->rowCount();

}

public function getTables() {
    $sql = "SELECT id_mesa AS 'N° Mesa', capacidad AS 'Capacidad'
            FROM mesa
            WHERE baja = FALSE";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function getTablePerOrder($order_id) {
    $sql = "SELECT id_mesa
            FROM mesa_pedido
            WHERE id_pedido = :id_pedido";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_pedido', $order_id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
public function InsertTable($id_mesa, $capacidad)
{
    $sql = "INSERT INTO mesa (id_mesa, capacidad)
     VALUES (:id_mesa, :capacidad)";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_mesa', $id_mesa, PDO::PARAM_INT);
    $stmt->bindParam(':capacidad', $capacidad, PDO::PARAM_INT);
    $stmt->execute();
    if($stmt->rowCount() == 0){
        return "No se ha modificado ninguna mesa";
    }else {
        return "Mesa modificada con éxito";
    }
    
}
public function UpdateTable($id_mesa, $capacidad)
{
    $sql = "UPDATE mesa SET capacidad = :capacidad WHERE id_mesa = :id_mesa";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_mesa', $id_mesa, PDO::PARAM_INT);
    $stmt->bindParam(':capacidad', $capacidad, PDO::PARAM_INT);
    $stmt->execute();
    if($stmt->rowCount() == 0){
        return "No se ha modificado ninguna mesa";
    }else {
        return "Mesa modificada con éxito";
    }
    
    return $stmt->rowCount(); 
}
}
?>