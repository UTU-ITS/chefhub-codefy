<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir el modelo
include dirname(__DIR__) . '/models/IngredientsModel.php';

class IngredientsController {
    private $ing;

    public function __construct($conn) {
        $this->ing = new Ingredients($conn); 
    }

    public function handleRequest($action, $productId = null) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                if ($productId) {
                    if ($action === 'allingredients') {
                        // Obtener todos los ingredientes para el producto con ID especificado
                        $result = $this->ing->GetIngredientsForProduct($productId);
                    } else {
                        // Acción no reconocida
                        $result = ["message" => "Acción no reconocida"];
                    }
                } else {
                    // Si no se proporciona un ID de producto, devolver un mensaje de error
                    $result = ["message" => "ID de producto no proporcionado"];
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