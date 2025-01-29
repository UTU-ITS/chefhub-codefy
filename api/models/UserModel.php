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




public function insertarUsuarioEmpleado($usuarioData, $empleadoData)
{
    try {
        $this->db->beginTransaction();

       
        $sqlUsuario = "INSERT INTO usuario (nombre, apellido, teléfono) VALUES (:nombre, :apellido, :telefono)";
        $stmt = $this->db->prepare($sqlUsuario);
        $stmt->bindParam(':nombre', $usuarioData['nombre']);
        $stmt->bindParam(':apellido', $usuarioData['apellido']);
        $stmt->bindParam(':telefono', $usuarioData['telefono']);
        $stmt->execute();

       
        $idUsuario = $this->db->lastInsertId();

       
        $sqlEmpleado = "INSERT INTO empleado (ci, id_usuario, id_cargo, email, clave, fecha_nacimiento, fecha_contratación, dirección, salario, horario_entrada, horario_salida, id_imagen) 
                        VALUES (:ci, :id_usuario, :id_cargo, :email, :clave, :fecha_nacimiento, :fecha_contratacion, :direccion, :salario, :horario_entrada, :horario_salida, :id_imagen)";
        $stmt = $this->db->prepare($sqlEmpleado);
        $stmt->bindParam(':ci', $empleadoData['ci']);
        $stmt->bindParam(':id_usuario', $idUsuario);
        $stmt->bindParam(':id_cargo', $empleadoData['id_cargo']);
        $stmt->bindParam(':email', $empleadoData['email']);
        $stmt->bindParam(':clave', $empleadoData['clave']);
        $stmt->bindParam(':fecha_nacimiento', $empleadoData['fecha_nacimiento']);
        $stmt->bindParam(':fecha_contratacion', $empleadoData['fecha_contratacion']);
        $stmt->bindParam(':direccion', $empleadoData['direccion']);
        $stmt->bindParam(':salario', $empleadoData['salario']);
        $stmt->bindParam(':horario_entrada', $empleadoData['horario_entrada']);
        $stmt->bindParam(':horario_salida', $empleadoData['horario_salida']);
        $stmt->bindParam(':id_imagen', $empleadoData['id_imagen']);
        $stmt->execute();

        // Confirmar la transacción
        $this->db->commit();

        return true;
    } catch (PDOException $e) {
        // Revertir la transacción en caso de error
        $this->db->rollBack();
        throw new Exception("Error al insertar usuario y empleado: " . $e->getMessage());
    }
}



public function CheckUser($email, $pass) {
    try {
        // Consulta para obtener el usuario
        $sql = "SELECT * FROM usuario WHERE email = :email AND clave = :pass";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':pass', $pass, PDO::PARAM_STR);
        $stmt->execute();

        // Verificar si se encontró un usuario
        if ($stmt->rowCount() > 0) {
            $user_data = $stmt->fetch(PDO::FETCH_OBJ);
            $id_usuario = $user_data->id_usuario;

            // Verificar si el usuario está registrado como cliente
            $client_check_query = "SELECT * FROM cliente WHERE id_usuario = :id_usuario";
            $client_check_stmt = $this->conn->prepare($client_check_query);
            $client_check_stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $client_check_stmt->execute();

            if ($client_check_stmt->rowCount() > 0) {
                $client_data = $client_check_stmt->fetch(PDO::FETCH_OBJ);
                return $user_data; // Retornar datos del cliente
            }

            // Verificar si el usuario está registrado como funcionario
            $employee_check_query = "SELECT f.ci, f.direccion, f.horario_entrada, f.horario_salida, f.cargo, 
                                            u.nombre, u.apellido, u.telefono, f.baja
                                      FROM funcionario f
                                      INNER JOIN usuario u ON f.id_usuario = u.id_usuario
                                      WHERE f.id_usuario = :id_usuario";
            $employee_check_stmt = $this->conn->prepare($employee_check_query);
            $employee_check_stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $employee_check_stmt->execute();

            if ($employee_check_stmt->rowCount() > 0) {
                $employee_data = $employee_check_stmt->fetch(PDO::FETCH_OBJ);
                return $employee_data; // Retornar datos del funcionario
            }

            // Si no es cliente ni funcionario
            return false;
        } else {
            // Usuario o contraseña incorrectos
            return false;
        }
    } catch (PDOException $e) {
        // Manejar errores de base de datos
        echo "Error en la base de datos: " . $e->getMessage();
        return false;
    }
}


public function CheckUserExist($email) {
    $sql = "SELECT * FROM usuario WHERE email = :email";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        return true;
    } else {
        return false;
    }
}



public function InsertClientUser ($email,$pass,$nombre,$apellido,$telefono){
    if ($this->CheckUserExist($email)==true){ 
        echo "El usuario ya existe: ";
        return false;
    }else{
    $sql = "INSERT INTO usuario (email, clave, nombre, apellido, telefono, fecha_creacion) VALUES (:email, :pass, :nombre, :apellido, :telefono, :fecha_creacion)";
    $fecha_creacion = Date('Y-m-d H:i:s');
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':pass', $pass);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':telefono', $telefono);
    $stmt->bindParam(':fecha_creacion',$fecha_creacion);
    return $stmt->execute();
    $this->InsertClient($this->IndexUserID($email)->id_usuario);
}
}

public function IndexUserID($email){
    $sql = "SELECT id_usuario FROM usuario WHERE email = :email";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_OBJ);
}


public function InsertClient ($id_usuario){
    $sql = "INSERT INTO cliente (id_usuario) VALUES (:id_usuario)";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    return $stmt->fetch(PDO::FETCH_OBJ);
}



}
?>