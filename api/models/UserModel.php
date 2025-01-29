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
    
    public function getCustomers(){
        $sql = "SELECT c.id_cliente, u.nombre AS 'Nombre', u.apellido AS 'Apellido', u.telefono AS 'Teléfono', u.email AS 'Correo'
                FROM cliente c
                JOIN usuario u ON c.id_usuario = u.id_usuario;
                WHERE u.baja = false";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCustomersAddress($id_cliente){
        $sql = "SELECT d.calle, d.esquina, d.n_puerta, d.referencia 
                FROM cliente c 
                JOIN pedido p ON c.id_cliente = p.id_cliente
                JOIN direccion d ON p.id_direccion = d.id_direccion
                WHERE c.id_cliente = :id_cliente
                AND c.baja = FALSE
                AND p.baja = FALSE
                AND d.baja = FALSE";
        
        $stmt = $this->conn->prepare($sql);
        // Aseguramos que el parámetro se pase correctamente
        $stmt->bindParam(':id_cliente', $id_cliente, PDO::PARAM_INT);
        $stmt->execute();
        
        // Retornamos los resultados como un arreglo asociativo
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