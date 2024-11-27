<?php
// Incluir la conexión a la base de datos y los controladores
require('models/db.php');
require('Controllers/CategoriesController.php');
require('Controllers/ProductController.php');
require('Controllers/IngredientsController.php');


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