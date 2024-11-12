<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir base de datos y modelo
include dirname(__DIR__) .'/models/ProductModel.php';

class ProductController {
    private $product;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->product = new Product($conn);  // Instancia del modelo Product
    }

    public function handleRequest($action, $productId = null) { // Asegúrate de que $action se pase aquí
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                if ($action === 'productbycategory') {
                    if ($productId) {
                        // Si hay un ID, obtener productos filtrados por categoría
                        $result = $this->product->getProduct($productId); // Llama a getProduct con el ID de categoría
                    } else {
                        // Si no hay ID, obtener todos los productos
                        $result = $this->product->getProduct(); // Llama a getProduct para obtener todos los productos
                    }
                }elseif ($action === 'products') {
                    // Si se accede a la acción "products", llamar a la función getProducts
                    $result = $this->product->getTableProducts();
                } else {
                    // Si no se especifica acción, devolver un mensaje de error
                    $result = ["message" => "Acción no reconocida"];
                }
    
                // Devolver el resultado como JSON
                echo json_encode($result);
                break;
                case "POST":
                if ($action == 'insertproduct') {
                    // Obtener datos del cuerpo de la solicitud
                    $data = json_decode(file_get_contents("php://input"), true);

                    if (!empty($data['nombre']) && !empty($data['precio']) && !empty($data['descripcion']) && !empty($data['imagen'])) {
                        // Insertar un nuevo producto
                        $result = $this->product->insertProduct($data);

                        // Verificar si el producto se insertó y devolver el ID o mensaje de error
                        if ($result) {
                            echo json_encode(["success" => true, "id" => $result, "message" => "Producto insertado con éxito."]);
                        } else {
                            echo json_encode(["success" => false, "message" => "Error al insertar el producto."]);
                        }
                    } else {
                        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
                    }
                }
                break;
            default:
                // Respuesta para métodos no soportados
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    }
}
?>
