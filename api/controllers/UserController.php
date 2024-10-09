<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Incluir base de datos y modelo
include '../models/db.php';
include '../models/UserModel.php';

// Conexión a la base de datos
$db = new DbConnect();
$conn = $db->connect();

// Crear instancia del modelo User
$user = new User($conn);

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {

    // Caso para obtener usuarios (GET)
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        $id = isset($path[3]) && is_numeric($path[3]) ? $path[3] : null;
        
        // Llamar al método del modelo para obtener usuarios
        $users = $user->getUsers($id);
        echo json_encode($users);
        break;

    // Caso para crear un registro de usuario (POST)
    case "POST":
        $input = json_decode(file_get_contents('php://input'));
        $email = $input->email;
        $pass = $input->pass;

        // Llamar al método del modelo para crear el usuario
        if($user->createUser($email, $pass)) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    default:
        // Método no soportado
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}
?>