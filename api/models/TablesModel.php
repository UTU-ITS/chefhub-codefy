<?php
class TablesModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getFreeHours($date)
    {
        $sql = "WITH possible_times AS (
                    SELECT '09:00' AS hora UNION
                    SELECT '10:00' UNION
                    SELECT '12:00' UNION
                    SELECT '13:00' UNION
                    SELECT '15:00' UNION
                    SELECT '16:00' UNION
                    SELECT '18:00' UNION
                    SELECT '19:00' UNION
                    SELECT '21:00' UNION
                    SELECT '22:00'
                ),
                total_mesas AS (
                    SELECT COUNT(*) AS total FROM mesa WHERE baja = 0
                ),
                horarios_ocupados AS (
                    SELECT cm.hora, COUNT(DISTINCT cm.id_mesa) AS mesas_ocupadas
                    FROM cliente_mesa cm
                    JOIN mesa m ON cm.id_mesa = m.id_mesa
                    WHERE cm.fecha = :date AND cm.baja = 0 AND m.baja = 0
                    GROUP BY cm.hora
                )
            SELECT pt.hora
            FROM possible_times pt
            CROSS JOIN total_mesas tm
            LEFT JOIN horarios_ocupados ho ON pt.hora = DATE_FORMAT(ho.hora, '%H:%i')
            WHERE ho.mesas_ocupadas IS NULL OR ho.mesas_ocupadas < tm.total;";
        
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

}
?>