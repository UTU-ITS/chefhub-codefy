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

    public function handleRequest($action,$categoryId = null) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                try {
                    if ($action == 'categories') {
                        $result = $this->cat->getCat();
                    } else if ($action == 'getcategorie') {
                        $result = $this->cat->getCatById($categoryId);
                    } else if ($action == 'getremovedcategories') {
                        $result = $this->cat->getRemovedCat();
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Acción no soportada"]);
                        return;
                    }
                    // Devolver el resultado como JSON
                    echo json_encode($result);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(["message" => "Error interno del servidor", "error" => $e->getMessage()]);
                }
                break;
            case "POST":
                if ($action == 'insertcategorie') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $imagen = $data['imagen'];
                    $nombre = $data['nombre'];
                    $descripcion = $data['descripcion'];

                    $result = $this->cat->InsertCat($nombre, $imagen, $descripcion);
                    if ($result) {
                        echo json_encode(["success" =>true]);
                    } else {
                        http_response_code(500);
                    }
                } else {
                    echo json_encode(["success" =>false ,"message" => "Acción no soportada"]);
                }
            break;
            case "PUT":
                if ($action == 'activatecategorie') {
                    
                    $data = json_decode(file_get_contents('php://input'), true);
                    $id_categoria = $data['id_categoria'];
                    $result = $this->cat->ActivateCat($id_categoria);
                    echo json_encode(["success" =>true ,"message" => $result . " categoría restaurada"]);
                    
                }else if ($action == 'deletecategorie') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $id_categoria = $data['id_categoria'];
                    $result = $this->cat->DeleteCat($id_categoria);
                    echo json_encode(["success" =>true ,"message" => $result . " categoría eliminada"]);


                }else if ($action == 'updatecategorie') {


                $data = json_decode(file_get_contents('php://input'), true);
                $id_categoria = $data['id_categoria'];
                $result = $this->cat->UpdateCat($id_categoria, $data['nombre'], $data['imagen'], $data['descripcion']);
                echo json_encode(["success" =>true ,"message" => $result . " categoría actualizada"]);


                }else{
                    echo json_encode(["message" => "Acción no soportada"]);
                }
                break;

            default:
                // Respuesta para métodos no soportados
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    }
    
    
}
