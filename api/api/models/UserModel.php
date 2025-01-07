<?php
class User {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getEmpolyees() {
        $sql = "SELECT f.ci AS 'Cedula', u.nombre AS 'Nombre', u.apellido AS 'Apellido', u.telefono AS 'Teléfono', f.direccion AS 'Dirección', f.horario_entrada AS 'Entrada', f.horario_salida AS 'Salida', f.cargo AS 'Cargo' 
                FROM funcionario f
                JOIN usuario u ON f.id_usuario = u.id_usuario;
                WHERE u.baja = false";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Insertar registro en login_log
    public function createUser($email, $pass) {
        $sql = "INSERT INTO login_log (email, pass) VALUES(:email, :pass)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':pass', $pass);
        return $stmt->execute();
    }
}
?>