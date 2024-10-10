<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Incluir base de datos y modelo
include '../models/db.php';
include '../models/ProductModel.php';

// Conexión a la base de datos
$db = new DbConnect();
$conn = $db->connect();

// Crear instancia del modelo Product
$product = new Product($conn);

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {

    // Caso para obtener productos(GET)
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        
        // Llamar al método del modelo para obtener usuarios
        $products = $product->getProduct();
        echo json_encode($products);
        break;
    
}
?>