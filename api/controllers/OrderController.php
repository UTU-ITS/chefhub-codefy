<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include dirname(__DIR__) .'/models/OrderModel.php';

class OrderController {
    private $order;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->order = new Order($conn);
    }

    public function handleRequest($action, $orderId = null) {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case "GET":
                if ($action === 'onlinequantity') {
                    $result = $this->order->getCantPendingOrders();
                } else if ($action === 'pendingorders'){
                    $result = $this->order->getPendingOrders();
                } else if($action === 'preparationorders'){
                    $result = $this->order->getInPreparationOrders();
                }else if($action === 'readyorders'){
                    $result = $this->order->getReadyOrders();
                } else if($action === 'detailorder'){
                    $result = $this->order->getDetailOrder($orderId);

                }else {
                    $result = ["message" => "Acción no reconocida"];
                }
                echo json_encode($result);
                break;
                case "POST":
                        if ($action === 'insertorder') {
                            $jsonPedido = file_get_contents("php://input");
                            $result = $this->order->insertarPedido($jsonPedido);
                        }


                    echo json_encode($result);
                    break;



                
            default:
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    }
}