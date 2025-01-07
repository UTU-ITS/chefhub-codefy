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
        $this->user = new User($conn);  // Instancia del modelo Product
    }

    public function handleRequest($action, $productId = null) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "GET":
                if ($action === 'employees') {
                    $result = $this->user->getEmpolyees();
                } else {
                    $result = ["message" => "Acción no reconocida"];
                }

                echo json_encode($result);
                break;
            default:
            echo json_encode(["message" => "Método no soportado"]);
            break;
        }
    }
}