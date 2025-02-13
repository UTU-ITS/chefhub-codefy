<?php
class PreferenceModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;

}
    public function getPreferences() {
        $sql = "SELECT * FROM dia_horario";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function UpdatePreference ( $dia_semana , $horario_apertura , $horario_cierre , $duracion_reserva ) {
        $sql = "UPDATE dia_horario SET horario_apertura = :horario_apertura, horario_cierre = :horario_cierre, duracion_reserva = :duracion_reserva WHERE dia_semana = :dia_semana";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':dia_semana', $dia_semana);
        $stmt->bindParam(':horario_apertura', $horario_apertura);
        $stmt->bindParam(':horario_cierre', $horario_cierre);
        $stmt->bindParam(':duracion_reserva', $duracion_reserva);
        $stmt->execute();
        return $stmt;
    }





}