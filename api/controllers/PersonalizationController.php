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

                default:
                    echo json_encode(["message" => "Método no soportado"]);
                    break;
        }
    }

}