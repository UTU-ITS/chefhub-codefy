<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include dirname(__DIR__) .'/models/ReservationModel.php';

class ReservationController {
    private $reservation;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->reservation = new Reservation($conn);
    }

    public function handleRequest($action) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "POST":
                if ($action === 'getreservation') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $fecha = $data['fecha'];
                    $hora = $data['hora'];
                    $result = $this->reservation->getReservation($fecha, $hora);
                } else  if ($action === 'getmyreservations') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $id_cliente = $data['id_cliente'];
                    $result = $this->reservation->getMyReservations($id_cliente);
                    if ($result) {
                        $result = ["success"=>true, "data" => $result];
                    } else {
                        $result = ["message" => "No se encontraron reservas", "success"=>false];
                    }
                } else{
                    $result = ["message" => "Acción no reconocida" ,"success"=>true  ];
                }
                echo json_encode($result);
            break;
            case "GET":
                if ($action === 'cantreservation') {
                    $result = $this->reservation->getCantReservation();
                } else {
                    $result = ["message" => "Acción no reconocida" ,"success"=>true  ];
                }
                echo json_encode($result);
                break;
            default:
            case "PUT":

            if ($action === 'cancelreservation') {
                $data = json_decode(file_get_contents('php://input'), true);
                $id_usuario = $data['id_usuario'];
                $id_mesa = $data['id_mesa'];
                $fecha = $data['fecha'];
                $hora = $data['hora'];
                $result = $this->reservation->updateReservation($id_usuario, $id_mesa, $fecha, $hora);
                echo json_encode($result ? ["success"=>true  ,"message" => "Reserva cancelada"] : ["message" => "Error al cancelar la reserva"]);

            } else {
                    
                echo json_encode(["message" => "Método no soportado"]);
                }
                break;
        }
    }
}