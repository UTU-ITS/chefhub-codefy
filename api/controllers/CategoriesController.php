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
include '../models/CategoriesModel.php';

// Conexión a la base de datos
$db = new DbConnect();
$conn = $db->connect();

$cat = new Categories($conn);

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        
        if (isset($_GET['id'])) {
            $id_producto = $_GET['id'];
            $cats = $cat->getCat($id_producto);
            echo json_encode($cats);
        } else {
            $cats = $cat->getCat();
            echo json_encode($cats);
        }
        break;
}