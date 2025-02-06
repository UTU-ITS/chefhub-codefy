<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include dirname(__DIR__) .'/models/UserModel.php';

class UserController {
    private $user;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->user = new User($conn);
    }

    public function handleRequest($action, $productId = null, $id_cliente = null) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "GET":
                if ($action === 'employees') {
                    $result = $this->user->getEmpolyees();
                } else if ($action === 'customers'){
                    $result = $this->user->getCustomers();
                } else if ($action === 'customersaddress'){
                    $result = $this->user->getAdresses($id_cliente);
               
                
                } else if ($action === 'getadresses'){

                    $result = $this->user->getAdresses($id_cliente);
               
                } else  {


                    $result = ["message" => "Acción no reconocida"];
                }

                echo json_encode($result);
                break;
            case "POST":
                 if ($action === 'signin') {
                    // Leer datos del cuerpo de la solicitud
                    $data = json_decode(file_get_contents("php://input"), true);

                    // Validar los datos recibidos
                    if (isset($data['email']) && isset($data['password'])) {
                        $email = $data['email'];
                        $password = $data['password'];

                        // Llamar al método del modelo para verificar usuario
                        $result = $this->user->CheckUser($email, $password);

                        if ($result) {
                            echo json_encode(["message" => "Autenticación exitosa", "data" => $result]);
                        } else {
                            http_response_code(401);
                            echo json_encode(["message" => "Usuario o contraseña incorrectos"]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Faltan parámetros"]);
                    }

                } else if ($action === 'signup') {
                    // Leer datos del cuerpo de la solicitud
                    $data = json_decode(file_get_contents("php://input"), true);
                
                    // Validar los datos recibidos
                    if (
                        isset($data['email']) &&
                        isset($data['pass']) &&
                        isset($data['nombre']) &&
                        isset($data['apellido']) &&
                        isset($data['telefono']) 
                    ) {
                        $email = $data['email'];
                        $pass = $data['pass'];
                        $nombre = $data['nombre'];
                        $apellido = $data['apellido'];
                        $telefono = $data['telefono'];
                
                        // Llamar al método del modelo para insertar el usuario
                        $result = $this->user->InsertClientUser($email, $pass, $nombre, $apellido, $telefono);
                
                        if ($result) {
                            echo json_encode(["message" => "Usuario registrado exitosamente", "data" => $result]);
                        } else {
                            http_response_code(500);
                            echo json_encode(["message" => "Error al registrar usuario"]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Faltan parámetros"]);
                    }
                }else if ($action === 'insertaddress') {
                    // Leer datos del cuerpo de la solicitud
                    $data = json_decode(file_get_contents("php://input"), true);
                
                    // Validar los datos recibidos
                    if (
                        isset($data['calle']) &&
                        isset($data['n_puerta']) &&
                        isset($data['apto']) &&
                        isset($data['id_usuario']) &&
                        isset($data['referencia']) 
                    ) {
                        $referencia = $data['referencia'];
                        $id_usuario = $data['id_usuario'];
                        $apto = $data['apto'];
                        $n_puerta = $data['n_puerta'];
                        $calle = $data['calle'];
                
                        // Llamar al método del modelo para insertar la dirección
                        $result = $this->user->InsertNewAddress($calle, $apto, $n_puerta, $referencia, $id_usuario);
                
                        if ($result) {
                            echo json_encode(["success" => true,"message" => "Dirección registrada exitosamente"]);
                        } else {
                            http_response_code(500);
                            echo json_encode(["message" => "Error al registrar la dirección"]);
                        }
                    }
                }else if ($action === 'checkemail') {
                    // Leer datos del cuerpo de la solicitud
                    $data = json_decode(file_get_contents("php://input"), true);
                    

                    // Validar los datos recibidos
                    if (
                        isset($data['email'])
                    ) {
                        $email = $data['email'];
                
                        // Llamar al método del modelo para insertar el usuario
                        $result = $this->user->CheckEmail($email);
                
                        if ($result) {
                            echo json_encode([ "success" => true,"message" => "Correo existe", "data" => $result]);
                        } else {
                            http_response_code(500);
                            echo json_encode(["message" => "Error al chequear correo"]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Faltan parámetros"]);
                    }
                }else if ($action === 'resetpassword') {
                    // Leer datos del cuerpo de la solicitud
                    $data = json_decode(file_get_contents("php://input"), true);
                    

                    // Validar los datos recibidos
                    if (
                        isset($data['pass']) &&
                        isset($data['id_usuario']))

                     {
                        $pass = $data['pass'];
                        $id_usuario = $data['id_usuario'];
                        // Llamar al método del modelo para insertar el usuario
                        $result = $this->user->ResetPassword($pass , $id_usuario);
                
                        if ($result) {
                            echo json_encode([ "success" => true]);
                        } else {
                            http_response_code(500);
                            echo json_encode(["message" => "Error al chequear correo"]);
                        }
                    } else if ($action === 'getpassword'){
                        // Leer datos del cuerpo de la solicitud
                        $data = json_decode(file_get_contents("php://input"), true);
                        
    
                        // Validar los datos recibidos
                        if (
                            isset($data['id_usuario']))
    
                         {
                            $id_usuario = $data['id_usuario'];
                            // Llamar al método del modelo para insertar el usuario
                            $result = $this->user->CheckPassword($id_usuario);
                    
                            if ($result) {
                                echo json_encode([ "success" => true, "data" => $result]);
                            } else {
                                http_response_code(500);
                                echo json_encode(["message" => "Error al chequear "]);
                            }
                        } else {
                            http_response_code(400);
                            echo json_encode(["message" => "Faltan parámetros"]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Faltan parámetros"]);
                    }
                }
                
                break;

            case "PUT":
                if ($action === 'deleteaddress') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $id_direccion = $data['id_direccion'];
                    $result = $this->user->DeleteAddress($id_direccion);


                } else if ($action === 'updatepassword') {


                    $data = json_decode(file_get_contents("php://input"), true);
                    $id_usuario = $data['id_usuario'];
                    $pass = $data['pass'];
                    $result = $this->user->UpdatePassword($id_usuario, $pass);
                    if ($result) {
                        echo json_encode([ "success" => true]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["message" => "Error al actualizar"]);
                    }
                } else if ($action === 'updatename') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $nombre = $data['nombre'];
                    $apellido = $data['apellido'];
                    $id_usuario = $data['id_usuario'];
                    $result = $this->user->UpdateUserName( $nombre, $apellido, $id_usuario);


                } else if ($action === 'deletecustomers') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $id_usuario = $data['id_usuario'];
                    $result = $this->user->DeleteClient($id_usuario);
                    $result1 = $this->user->DeleteUser($id_usuario);

                    if ($result && $result1) {
                        echo json_encode([ "success" => true]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["message" => "Error al actualizar", "data" => ["result" => $result, "result1" => $result1]]);
                    }

                }else if ($action === 'deleteemployee') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $id_usuario = $data['id_usuario'];
                    echo "aaaaaa".$id_usuario;
                    $result = $this->user->DeleteEmployee($id_usuario);
                    $result1 = $this->user->DeleteUser($id_usuario);

                    if ($result && $result1) {
                        echo json_encode([ "success" => true]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["message" => "Error al actualizar", "data" => ["result" => $result, "result1" => $result1]]);
                    }

                }else{
                    echo json_encode(["message" => "Acción no reconocida"]);
                }
                break;
            default:
            echo json_encode(["message" => "Método no soportado"]);
            break;
        }
    }
}
?>
