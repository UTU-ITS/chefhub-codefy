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
                if ($action === 'allingredients') {
                    // Obtener todos los ingredientes
                    $result = $this->ing->GetIngredients();
                } else if ($action === 'perproduct') {
                    // Obtener todos los ingredientes para el producto con ID especificado
                    $result = $this->ing->GetIngredientsForProduct($productId);
                } else if ($action === 'deletedingredient') {
                    // Obtener todos los ingredientes eliminados para el producto con ID especificado
                    $result = $this->ing->GetDeletedIngredients();
                } else {
                    // Acción no reconocida
                    $result = ["message" => "Acción no reconocida"];
                }

                // Devolver el resultado como JSON
                echo json_encode($result);
                break;

            case "POST":
                // Decodificar el JSON recibido
                $data = json_decode(file_get_contents("php://input"));
                if ($action === 'insertingredient') {
                    $result = $this->ing->InsertIngredient($data->nombre, $data->precio);
                } else {
                    $result = ["message" => "Acción no reconocida"];
                }

                // Devolver el resultado como JSON
                echo json_encode($result);
                break;

            case "PUT":
                // Decodificar el JSON recibido
                $data = json_decode(file_get_contents("php://input"));
                if ($action === 'updateingredient') {
                    $result = $this->ing->UpdateIngredient($data->id_ingrediente, $data->nombre, $data->precio);
                    if ($result == 0) {
                        $result = ["message" => "No se encontró el ingrediente"];
                    } else {
                        $result = ["success" => true, "message" => "Ingrediente actualizado"];
                    }
                } else if ($action === 'deleteingredient') {
                    $result = $this->ing->DeleteIngredient($data->id_ingrediente);
                    if ($result == 0) {
                        $result = ["message" => "No se encontró el ingrediente"];
                    } else {
                        $result = ["success" => true, "message" => "Ingrediente eliminado"];
                    }
                } else if ($action === 'activateingredient') {
                    $result = $this->ing->ActivateIngredient($data->id_ingrediente);
                    if ($result == 0) {
                        $result = ["message" => "No se encontró el ingrediente"];
                    } else {
                        $result = ["success" => true, "message" => "Ingrediente activo"];
                    }
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
