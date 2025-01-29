<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir base de datos y modelo
include dirname(__DIR__) .'/models/TablesModel.php';

class TablesController {
    private $tables;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->tables = new TablesModel($conn);  // Instancia del modelo Table, no el controlador
    }

    public function handleRequest($action, $date = null , $time = null) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                // Lógica existente para GET
                if ($action === 'freehours') {
                    if ($date) {
                        $result = $this->tables->getFreeHours($date);  // Verifica que este método esté en el modelo
                    } else {
                        $result = ["message" => "Fecha no especificada"];
                    }
                } else if ($action === 'freetables') {
                    if ($date && $time) {
                        $result = $this->tables->getFreeTables($date,$time);  // Verifica que este método esté en el modelo
                    } else {
                        $result = ["message" => "Fecha u hora no especificada"];
                    }
                } else if ($action === 'tables'){
                    $result = $this->tables->getTables();
                } else {
                    $result = ["message" => "Acción no reconocida"];
                }
    
                echo json_encode($result);
                break;
    
                case "POST":

                $inputData = json_decode(file_get_contents('php://input'), true);
    
                if ($action === 'freetables') {
                    if (isset($inputData['date']) && isset($inputData['time'])) {
                        $date = $inputData['date'];
                        $time = $inputData['time'];
                        $result = $this->tables->getFreeTables($date, $time);
                    } else {
                        $result = ["message" => "Fecha u hora no especificada"];
                    } 
                } else if ($action === 'insertreservations') {
                    if (isset($inputData['id_mesa']) 
                    && isset($inputData['id_cliente']) 
                    && isset($inputData['fecha']) 
                    && isset($inputData['hora']) 
                    && isset($inputData['nombre_reserva']) 
                    && isset($inputData['tel_contacto'])
                    && isset($inputData['cant_personas'])) {
                        
                        $id_mesa = $inputData['id_mesa'];
                        $id_cliente = $inputData['id_cliente'];
                        $fecha = $inputData['fecha'];
                        $hora = $inputData['hora'];
                        $nombre_reserva = $inputData['nombre_reserva'];
                        $cant_personas = $inputData['cant_personas'];
                        $tel_contacto = $inputData['tel_contacto'];
                        $result = $this->tables->insertReservations($id_mesa, $id_cliente, $fecha, $hora,$cant_personas ,$nombre_reserva, $tel_contacto);  // Llama a tu modelo con los datos obtenidos
                    } else {
                        $result = ["message" => "Faltan valores para la reserva"];
                    } 
                }else {
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
