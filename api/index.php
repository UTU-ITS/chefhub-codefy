<?php
// Incluir la conexión a la base de datos y los controladores
require('models/db.php');
require('Controllers/CategoriesController.php');
require('Controllers/ProductController.php');
require('Controllers/IngredientsController.php');
require('Controllers/UserController.php');
require('Controllers/OrderController.php');
require('Controllers/ReservationController.php');
require('Controllers/TablesController.php');
require('Controllers/TokenController.php');


// Crear la conexión una vez y reutilizarla
$db = new DbConnect();
$conn = $db->connect();

// Obtener la ruta de la URL para distinguir entre productos y categorías
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

if (isset($path[1])) {
    switch ($path[1]) {
        case 'products':
            $ProductController = new ProductController($conn);
            // Obtener todos los productos
            if (!isset($path[2])) {
                $ProductController->handleRequest('products'); // Maneja la solicitud sin ID
            } else {
                echo json_encode(["message" => "Ruta no válida"]);
            }
            break;

        case 'productbycategory':
            $ProductController = new ProductController($conn);
            // Obtener productos por categoría
            if (isset($path[2])) {
                $categoryId = $path[2];
                $ProductController->handleRequest('productbycategory', $categoryId); // Pasamos el ID
            } else {
                // Si no se proporciona un ID de categoría, devolver todos los productos
                $ProductController->handleRequest('productbycategory'); // Llama para obtener todos los productos
            }
            break;

        case 'categories':
            $CategoriesController = new CategoriesController($conn);
            // Obtener todas las categorías
            if (!isset($path[2])) {
                $CategoriesController->handleRequest(); // Maneja la solicitud sin ID
            } elseif (isset($path[2])) {
                $categoryId = $path[2];
                $CategoriesController->handleRequest($categoryId); // Maneja la solicitud con ID
            } else {
                echo json_encode(["message" => "Ruta no válida"]);
            }
            break;
            case 'insertproduct':
                $ProductController = new ProductController($conn);
                $ProductController->handleRequest('insertproduct');
                break;            

            case 'ingredients':
                $IngredientsController = new IngredientsController($conn);
    
                if (!isset($path[2])) {
                    $IngredientsController->handleRequest('allingredients'); // Maneja la solicitud sin ID
                } elseif ($path[2] === 'perproduct' && isset($path[3])) {
                    $productId = $path[3];
                    $IngredientsController->handleRequest('perproduct', $productId); // Maneja la solicitud con acción e ID
                } else {
                    echo json_encode(["message" => "Ruta no válida"]);
                }
                break;
            case 'empolyees':
                $UserController = new UserController($conn);
                $UserController->handleRequest('employees');
                break;
            case 'customers':
                $UserController = new UserController($conn);
                if (!isset($path[2])) {
                    $UserController->handleRequest('customers');                
                } else if ($path[2] === 'address' && isset($path[3])) {
                    $customerId = $path[3];
                    $UserController->handleRequest('customersaddress', $customerId);
                } else {
                    echo json_encode(["message" => "Ruta no válida"]);
                    
                }
                break;
            case 'orders':
                $OrderController = new OrderController($conn);

                if ($path[2] === 'pending') {
                    $OrderController->handleRequest('pendingorders', null, null);
                } else if($path[2] === 'preparation'){
                    $OrderController->handleRequest('preparationorders');
                }else if($path[2] === 'ready'){
                    $OrderController->handleRequest('readyorders');
                }else if ($path[2] === 'onlinequantity') {
                    $OrderController->handleRequest('onlinequantity');
                }else if($path[2] === 'detail' && isset($path[3])){
                    $orderId = $path[3];
                    $OrderController->handleRequest('detailorder', $orderId, null);
                } else {
                    echo json_encode(["message" => "Ruta no válida"]);
                }
                break;

            case 'cantreservation':
                $ReservationController = new ReservationController($conn);
                $ReservationController->handleRequest('cantreservation');
                break;

                case 'tables':
                    $TableController = new TablesController($conn);
                    if (!isset($path[2])) {
                        $TableController->handleRequest('tables');
                    } else if (isset($path[2]) && $path[2] === 'perorder' && isset($path[3])) {
                        $order_id = $path[3];
                        $TableController->handleRequest('perorder', null, null, $order_id);
                    } else {
                        echo json_encode(["message" => "Ruta no válida (ID no proporcionado)"]);
                    }
                    break;

            case 'empolyees':
                $UserController = new UserController($conn);
                $UserController->handleRequest('employees');
                break;

            case 'login':
                $UserController = new UserController($conn);
                $UserController->handleRequest('signin');
                break;

                case 'signup':
                    $UserController = new UserController($conn);
                    $UserController->handleRequest('signup');
                    break;

                    case 'freehours':
                        $TablesController = new TablesController($conn);
                        $TablesController->handleRequest('freehours', $path[2]);
                        break;
                    case 'freetables': // Para verificar el valor
                        $TablesController = new TablesController($conn);
                        $TablesController->handleRequest('freetables');
                        break;

                        case 'insertreservations': // Para verificar el valor
                            $TablesController = new TablesController($conn);
                            $TablesController->handleRequest('insertreservations');
                            break;
                    case 'getadresses': 
                        $UserController = new UserController($conn);
        
                        if (isset($path[2])) {  
                            
                            $id_cliente = $path[2];  
                            $UserController->handleRequest('getadresses', null, $id_cliente);
                        } else {
                            echo json_encode(["message" => "Ruta no válida (ID no proporcionado)"]);
                        }
                        break;
                        case 'insertorder': // Para verificar el valor
                            $OrderController = new OrderController($conn);
                            $OrderController->handleRequest('insertorder');
                            break;
                        case 'insertaddress': // Para verificar el valor
                            $UserController = new UserController($conn);
                            $UserController->handleRequest('insertaddress');
                            break;
                        case 'sendmail': 
                            $TokenController = new TokenController($conn);
                            $TokenController->handleRequest('sendmail');
                            break;
                        case 'checktoken': 
                            $TokenController = new TokenController($conn);
                            $TokenController->handleRequest('checktoken');
                            break;
                                
                                 
            default:
       
            // Si no coincide con ninguno, devuelve un error
            echo json_encode(["message" => "Endpoint no encontrado"]);
            break;
    }
} else {
    // Si no se proporciona ninguna ruta, devuelve un error
    echo json_encode(["message" => "Ruta no válida"]);
}
?>