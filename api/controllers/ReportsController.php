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

    public function handleRequest($action, $table = null) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "GET":
                if ($action === 'tables') {
                    $result = $this->reports->getTables();
                } else if ($action === 'columns') {
                    $tablesForJoin = $this->reports->getJoinsForTable($table);
                    if ($tablesForJoin == "No se encontraron tablas para hacer JOIN con la tabla '$table'") {
                        $tables[] = $table;
                    } else {
                        $tables = array_merge([$table], $tablesForJoin);
                    }
                    $columns = $this->reports->getColumns($tables);

                    $result = $columns;
                    
                } else {
                    $result = ["message" => "Acción no reconocida" ,"success"=>true  ];

                }
                echo json_encode($result);
                break;
            default:
            case 'POST':
                if ($action === 'generatereport') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $table = $data['table'];
                    $columns = $data['columns'];
                    $conditions = $data['conditions'];
                    $classifications = $data['classifications'];
                    $foreignKeys = $this->reports->getForeignKeys($table);
                    $sql = $this->reports->generateJoinQuery($table, $foreignKeys, $columns, $conditions, $classifications);
                    $result = $this->reports->executeQuery($sql);
                    if ($result == null) {
                        $result = ["message" => "No se encontraron resultados", "success" => false];
                    } else {
                        $result = ["message" => "Reporte generado con éxito", "success" => true, "data" => $result];
                    }
                    echo json_encode($result);
                } else {
                    $result = ["message" => "Acción no reconocida" ,"success"=>true  ];
                }
                break;
        }
    }
}