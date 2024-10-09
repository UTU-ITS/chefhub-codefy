<?php
class User {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los usuarios o un usuario por ID
    public function getUsers($id = null) {
        $sql = "SELECT * FROM users";
        if ($id !== null) {
            $sql .= " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
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