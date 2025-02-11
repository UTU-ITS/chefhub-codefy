<?php
class User {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getEmpolyees() {
        $sql = "SELECT f.id_usuario , f.ci AS 'Cedula', u.nombre AS 'Nombre', u.apellido AS 'Apellido', u.telefono AS 'Teléfono', f.direccion AS 'Dirección', f.horario_entrada AS 'Entrada', f.horario_salida AS 'Salida', f.cargo AS 'Cargo' 
                FROM funcionario f
                JOIN usuario u ON f.id_usuario = u.id_usuario
                WHERE u.baja = false";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getCustomers(){
        $sql = "SELECT c.id_usuario AS id, c.id_cliente, u.nombre AS 'Nombre', u.apellido AS 'Apellido', u.telefono AS 'Teléfono', u.email AS 'Correo'
                FROM cliente c
                JOIN usuario u ON c.id_usuario = u.id_usuario
                WHERE c.baja = 0 AND u.baja = 0";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCustomersAddress($id_cliente){
        $sql = "SELECT d.calle, d.apto, d.n_puerta, d.referencia 
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

            // Inicializar id_cliente como NULL por defecto
            $user_data->id_cliente = null;

            // Verificar si el usuario está registrado como cliente
            $client_check_query = "SELECT id_cliente FROM cliente WHERE id_usuario = :id_usuario";
            $client_check_stmt = $this->conn->prepare($client_check_query);
            $client_check_stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $client_check_stmt->execute();

            if ($client_check_stmt->rowCount() > 0) {
                $client_data = $client_check_stmt->fetch(PDO::FETCH_OBJ);
                $user_data->id_cliente = $client_data->id_cliente;
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
                return $employee_data; // Si es funcionario, retorna sus datos
            }

            return $user_data; // Si es cliente o solo usuario normal, retorna el objeto con id_cliente
        } 
        
        return false; // Usuario o contraseña incorrectos

    } catch (PDOException $e) {
        error_log("Error en CheckUser: " . $e->getMessage()); // Loguea el error sin mostrarlo al usuario
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
        echo json_encode (["message" => "El usuario ya existe"]);
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
    $stmt->execute();
    $this->InsertClient($this->IndexUserID($email)->id_usuario);
    return true;
}
}

public function IndexUserID($email){
    $sql = "SELECT id_usuario FROM usuario WHERE email = :email";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_OBJ);
}


public function InsertClient($id_usuario) {
    $sql = "INSERT INTO cliente (id_usuario) VALUES (:id_usuario)";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
    
    return $stmt->execute();
}


public function getAdresses($id_cliente){
    $sql = "SELECT d.id_direccion, d.calle, d.apto, d.n_puerta, d.referencia 
            FROM direccion d
            JOIN usuario u ON u.id_usuario = d.id_usuario
            WHERE u.id_usuario= :id_cliente
            AND u.baja = FALSE
            AND d.baja = FALSE";
    
    $stmt = $this->conn->prepare($sql);
    // Aseguramos que el parámetro se pase correctamente
    $stmt->bindParam(':id_cliente', $id_cliente, PDO::PARAM_INT);
    $stmt->execute();
    
    // Retornamos los resultados como un arreglo asociativo
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function InsertNewAddress($calle, $apto, $n_puerta, $referencia, $id_usuario){
    $sql = "INSERT INTO direccion (calle, apto, n_puerta, referencia, id_usuario) 
            VALUES (:calle, :apto, :n_puerta, :referencia, :id_usuario)";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':calle', $calle);
    $stmt->bindParam(':apto', $apto);
    $stmt->bindParam(':n_puerta', $n_puerta);
    $stmt->bindParam(':referencia', $referencia);
    $stmt->bindParam(':id_usuario', $id_usuario);

    return $stmt->execute(); // Devolver true si es exitoso, false si falla
}


public function CheckEmail($email) {
    $sql = "SELECT id_usuario FROM usuario WHERE email = :email LIMIT 1"; // Agregar LIMIT 1 para optimizar la consulta
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    // Usar fetchColumn para obtener solo el primer valor, que es id_usuario
    $id_usuario = $stmt->fetchColumn();
    if ($id_usuario) {
        return $id_usuario; // Retornar id_usuario si el correo existe
    } else {
        return false; // El correo no existe
    }
}
public function ResetPassword($pass, $id_usuario) {
    $sql = "UPDATE usuario SET clave = :pass WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':pass', $pass);
    $stmt->bindParam(':id_usuario', $id_usuario);
    return $stmt->execute();
}
public function DeleteAddress($id_direccion){
    $sql = "UPDATE direccion SET baja = TRUE WHERE id_direccion = :id_direccion";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_direccion', $id_direccion);
    return $stmt->execute();
}
public function UpdatePassword($pass, $id_usuario) {
    $sql = "UPDATE usuario SET clave = :pass WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':pass', $pass);
    $stmt->bindParam(':id_usuario', $id_usuario);
    return $stmt->execute();


}
public function CheckPassword($pass, $id_usuario) {
    $sql = "SELECT clave FROM usuario WHERE clave = :pass AND id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':pass', $pass);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();


    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {

        return $result['clave'];

    } else {

        return false;
    }
}

public function UpdateUserName($nombre, $apellido, $id_usuario) {
    $sql = "UPDATE usuario SET nombre = :nombre, apellido = :apellido WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':id_usuario', $id_usuario);
    return $stmt->execute();


}
public function DeleteClient($id_usuario){
  
    $sql = "UPDATE cliente SET baja = TRUE WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        return true;
    } else {
        return false;
    }
}

public function DeleteUser($id_usuario){
    $sql = "UPDATE usuario SET baja = TRUE WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        return true;
    } else {
        return false;
    }
}

public function DeleteEmployee($id_usuario){
    $sql = "UPDATE funcionario SET baja = TRUE WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        return true;
    } else {
        return false;
    }
}

public function insertEmployee($usuarioData) {
    try {
        $this->conn->beginTransaction();

        // Insertar en la tabla usuario
        $sqlUsuario = "INSERT INTO usuario (email, clave, nombre, apellido, telefono) 
                        VALUES (:email, :clave, :nombre, :apellido, :telefono)";
        $stmt = $this->conn->prepare($sqlUsuario);
        $stmt->bindParam(':email', $usuarioData['email']);
        $stmt->bindParam(':clave', $usuarioData['clave']);
        $stmt->bindParam(':nombre', $usuarioData['nombre']);
        $stmt->bindParam(':apellido', $usuarioData['apellido']);
        $stmt->bindParam(':telefono', $usuarioData['telefono']);
        $stmt->execute();

        // Verificar si el usuario se insertó correctamente
        $idUsuario = $this->conn->lastInsertId();
        if (!$idUsuario) {
            throw new Exception("No se pudo obtener el ID del usuario insertado.");
        }

        // Insertar en la tabla funcionario
        $sqlEmpleado = "INSERT INTO funcionario (ci, fecha_nacimiento, direccion, horario_entrada, horario_salida, cargo, id_usuario) 
                        VALUES (:ci, :fecha_nacimiento, :direccion, :horario_entrada, :horario_salida, :cargo, :id_usuario)";
        $stmt = $this->conn->prepare($sqlEmpleado);
        $stmt->bindParam(':ci', $usuarioData['ci']);
        $stmt->bindParam(':fecha_nacimiento', $usuarioData['fecha_nacimiento']);
        $stmt->bindParam(':direccion', $usuarioData['direccion']);
        $stmt->bindParam(':horario_entrada', $usuarioData['horario_entrada']);
        $stmt->bindParam(':horario_salida', $usuarioData['horario_salida']);
        $stmt->bindParam(':cargo', $usuarioData['cargo']);
        $stmt->bindParam(':id_usuario', $idUsuario);
        $stmt->execute();

        // Confirmar la transacción
        $this->conn->commit();

        return true;
    } catch (PDOException $e) {
        $this->conn->rollBack();
        throw new Exception("Error al insertar usuario y empleado: " . $e->getMessage());
    }
}

public function UpdateEmployee($direccion, $horario_entrada, $horario_salida, $cargo, $id_usuario) {
    $sql = "UPDATE funcionario SET direccion = :direccion, horario_entrada = :horario_entrada, horario_salida = :horario_salida, cargo = :cargo WHERE id_usuario = :id_usuario";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':direccion', $direccion);
    $stmt->bindParam(':horario_entrada', $horario_entrada);
    $stmt->bindParam(':horario_salida', $horario_salida);
    $stmt->bindParam(':cargo', $cargo);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        return true;
    } else {
        return false;
    }

}

}
?>