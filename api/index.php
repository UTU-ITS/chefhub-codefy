<?php
// Incluir la conexión a la base de datos y los controladores
require('models/db.php');
require('Controllers/CategoriesController.php');
require('Controllers/ProductController.php');
require('Controllers/IngredientsController.php');
require('Controllers/UserController.php');
require('Controllers/OrderController.php');
require('Controllers/ReservationController.php');
require('Controllers/TableController.php');

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
                    $UserController->handleRequest('customers');                } else if ($path[2] === 'address' && isset($path[3])) {
                    $customerId = $path[3];
                    $UserController->handleRequest('customersaddress', $customerId);
                } else {
                    echo json_encode(["message" => "Ruta no válida"]);
                    
                }
                break;
            case 'orders':
                $OrderController = new OrderController($conn);

                if (!isset($path[2])) {
                    $OrderController->handleRequest('orders');
                } else if ($path[2] === 'onlinequantity') {
                    $OrderController->handleRequest('onlinequantity');
                } else {
                    echo json_encode(["message" => "Ruta no válida"]);
                }
                break;

            case 'cantreservation':
                $ReservationController = new ReservationController($conn);
                $ReservationController->handleRequest('cantreservation');
                break;

            case 'tables':
                $TableController = new TableController($conn);
                $TableController->handleRequest('tables');
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