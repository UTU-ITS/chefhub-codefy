<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include dirname(__DIR__) .'/models/ReportsModel.php';

class ReportsController {
    private $reports;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->reports = new Reports($conn);
    }

    public function handleRequest($action) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "GET":
                if ($action === 'columnsdb') {
                    $result = $this->reports->getReport();
                } else {
                    $result = ["message" => "Acción no reconocida" ,"success"=>true  ];
                }
                echo json_encode($result);
                break;
            default:
        }
    }
}