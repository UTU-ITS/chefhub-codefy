<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include dirname(__DIR__) .'/models/TableModel.php';

class TableController {
    private $table;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->table = new Table($conn);
    }

    public function handleRequest($action) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "GET":
                if ($action === 'tables') {
                    $result = $this->table->getTables();
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