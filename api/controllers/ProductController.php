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

    public function handleRequest($action, $productId = null) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                // Lógica existente para GET
                if ($action === 'productbycategory') {
                    if ($productId) {
                        $result = $this->product->getProduct($productId);
                    } else {
                        $result = $this->product->getProduct();
                    }
                } else if ($action === 'products') {

                    $result = $this->product->getTableProducts();

                } else if ($action === 'getremovedproducts') {

                    $result = $this->product->getTableRemovedProducts();

                } else {
                    $result = ["message" => "Acción no reconocida"];
                }
    
                echo json_encode($result);
                break;
    
                case "POST":
                    if ($action === 'insertproduct') {
                        // Leer datos de la solicitud POST
                        $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
                        $precio = isset($_POST['precio']) ? $_POST['precio'] : null;
                        $descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : null;
                        $imagenFile = isset($_FILES['imagen']) ? $_FILES['imagen'] : null;
                        $ingredientes = isset($_POST['ingredientes']) ? $_POST['ingredientes'] : null;
                        $categorias = isset($_POST['categorias']) ? $_POST['categorias'] : null;
                
                        if ($nombre && $precio && $descripcion && $imagenFile) {
                            try {
                                // Insertar producto con la imagen
                                $productId = $this->product->insertProduct(
                                    $nombre,
                                    $precio,
                                    $descripcion,
                                    $imagenFile
                                );

                                // Insertar ingredientes del producto
                                if ($ingredientes) {
                                    $this->product->insertProductIngredients($productId, $ingredientes);
                                } 
                                
                                // Insertar categorías del producto
                                if ($categorias) {
                                    $this->product->insertProductCategories($productId, $categorias);
                                }
                                
                                // Solo enviar mensaje de éxito si la inserción es exitosa
                                echo json_encode([
                                    "message" => "Producto insertado con éxito",
                                    "product_id" => $productId,
                                 "success"=>true
                                ]);
                            } catch (Exception $e) {
                                http_response_code(500);
                                // Asegúrate de mostrar solo el mensaje de error real
                                echo json_encode(["message" => "Error al agregar el producto: " . $e->getMessage()]);
                            }
                        } else {
                            http_response_code(400);
                            echo json_encode(["message" => "Datos incompletos o archivo faltante"]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Acción no reconocida para POST"]);
                    }
                    break;  
                    case "PUT":
                        if ($action === 'updateproduct') {
                            // Leer datos de la solicitud PUT
                            $data = json_decode(file_get_contents("php://input"), true);
                            $productId = $data['id_producto'];
                            $nombre = $data['nombre'];
                            $precio = $data['precio'];
                            $descripcion = $data['descripcion'];
                            $imagenFile = isset($_FILES['imagen']) ? $_FILES['imagen'] : null;
                            $ingredientes = $data['ingredientes'];
                            $categorias = $data['categorias'];
                            // Validar que los datos esenciales estén presentes
                            if ($productId && $nombre && $precio && $descripcion) {
                                try {
                                    // Actualizar el producto
                                    $this->product->updateProduct(
                                        $productId,
                                        $nombre,
                                        $precio,
                                        $descripcion,
                                        $imagenFile,
                                        $ingredientes,
                                        $categorias
                                    );
                        
                                    // Respuesta exitosa
                                    echo json_encode(["message" => "Producto modificado con éxito", "success" => true]);
                                } catch (Exception $e) {
                                    // Si ocurre un error en la actualización
                                    http_response_code(500);
                                    echo json_encode([
                                        "message" => "Error al actualizar el producto: " . $e->getMessage(),
                                        "code" => $e->getCode(), // Muestra el código del error
                                        "trace" => $e->getTraceAsString() // Muestra el trace completo del error
                                    ]);
                                }
                            } else {
                                // Si faltan datos obligatorios
                                http_response_code(400);
                                echo json_encode(["message" => "Datos incompletos o archivo faltante"]);
                            }
                        }else if($action === 'deleteproduct') {    
                            $data = json_decode(file_get_contents("php://input"), true);
                            $id_producto = $data['id_producto'];
                            $result = $this->product->DeleteProduct($id_producto);
                            if ($result) {
                                echo json_encode(["message" => "Producto eliminado con éxito" ,"success"=>true ]);
                            } else {
                                http_response_code(400);
                                echo json_encode(["message" => "Datos incompletos"]);
                            }
                        } else if($action === 'activateproduct') {    
                            $data = json_decode(file_get_contents("php://input"), true);
                            $id_producto = $data['id_producto'];
                            $result = $this->product->ActivateProduct($id_producto);
                            if ($result) {
                                echo json_encode(["success"=>true ]);
                            } else {
                                http_response_code(400);
                                echo json_encode(["message" => "Datos incompletos"]);
                            }
                        }else {
                            http_response_code(400);
                            echo json_encode(["message" => "Acción no reconocida para PUT"]);
                        }
                        break;              
                
    
            default:
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    }
}
?>
