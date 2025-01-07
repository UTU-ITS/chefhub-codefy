<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir el modelo
include dirname(__DIR__) . '/models/CategoriesModel.php';

class CategoriesController {
    private $cat;

    // Modificación: Recibe la conexión a la base de datos desde el constructor
    public function __construct($conn) {
        $this->cat = new Categories($conn);  // Instancia del modelo Categories con la conexión proporcionada
    }

    public function handleRequest($categoryId = null) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                if ($categoryId) {
                    // Si hay un ID, obtener categoría por ID
                    $result = $this->cat->getCatById($categoryId);
                } else {
                    // Si no hay ID, obtener todas las categorías
                    $result = $this->cat->getCat();
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
