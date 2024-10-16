<?php
// Incluir la conexión a la base de datos y los controladores
require('models/db.php');
require('Controllers/CategoriesController.php');
require('Controllers/ProductController.php');

// Crear la conexión una vez y reutilizarla
$db = new DbConnect();
$conn = $db->connect();

// Obtener la ruta de la URL para distinguir entre productos y categorías
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));


if (isset($path[1])) {
    switch ($path[1]) {
        case 'products':

            $ProductController = new ProductController($conn);
            if (isset($path[2])) {

                $productId = $path[2];
                $ProductController->handleRequest($productId);
            } else {

                $ProductController->handleRequest();
            }
            break;

        case 'categories':
            // Si la URL incluye "categories", pasa la solicitud a CategoriesController
            $CategoriesController = new CategoriesController($conn);
            if (isset($path[2])) {
                // Si hay un ID en la URL (ej. /api/categories/1), pasar el ID al controlador
                $categoryId = $path[2];
                $CategoriesController->handleRequest($categoryId);
            } else {
                // Sin ID, se obtienen todas las categorías
                $CategoriesController->handleRequest();
            }
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
