<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Incluir base de datos y modelo
include dirname(__DIR__) .'../models/ProductModel.php';

class ProductController {
    private $product;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->product = new Product($conn);  // Instancia del modelo Product
    }

    public function handleRequest($productId = null) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                if ($productId) {
                    // Si hay un ID, obtener producto por ID
                    $result = $this->product->getProduct($productId);
                } else {
                    // Si no hay ID, obtener todos los productos
                    $result = $this->product->getProduct();
                }
    
                // Devolver el resultado como JSON
                echo json_encode($result);
                break;
    
            default:
                // Respuesta para métodos no soportados
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    }
    
}
?>