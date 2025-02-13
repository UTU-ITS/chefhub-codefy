<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir base de datos y modelo
include dirname(__DIR__) .'/models/PersonalizationModel.php';

class PersonalizationController {
    private $personalization;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->personalization = new Personalization($conn);  // Instancia del modelo Product
    }

    public function handleRequest($action) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                if ($action === 'color') {
                    $result = $this->personalization->getColor();
                } else {
                    $result = ["message" => "Acción no reconocida"];
                }
                echo json_encode($result);
                break;
            case "PUT":
                if ($action === 'updatecolor') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $color = $data['color'];
                    $result = $this->personalization->updateColor($color);
                    if ($result) {
                        echo json_encode(["message" => "Color actualizado"]);
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "No se pudo actualizar el color"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Acción no reconocida para PUT"]);
                }
                break;
                default:
                    echo json_encode(["message" => "Método no soportado"]);
                    break;
        }
    }

}