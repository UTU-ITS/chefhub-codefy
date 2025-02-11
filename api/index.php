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
require('Controllers/ReportsController.php');

require __DIR__.'\vendor\autoload.php';
use MercadoPago\Client\Payment\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
$access_token = "APP_USR-5865558838187477-020615-2302c3889cb69404412550090df0ce2e-2255431918";

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

            case 'payment':
                MercadoPago\SDK::setAccessToken($access_token);
                $preference = new MercadoPago\Preference();
                
                $preference->back_urls = array(
                    "success" => "http://localhost:5173/success",
                    "failure" => "http://localhost:5173/fail",
                    "pending" => "https://localhost/mercadopago/fail.php",
                );

                $preference->auto_return = "approved";
                
                $productos = [];
                
                // Decodifica el JSON recibido en el cuerpo de la solicitud
                $data = json_decode(file_get_contents('php://input'), true);
            
                // Verifica si 'items' existe en los datos recibidos
                if (isset($data['items']) && is_array($data['items'])) {
                    $itemsData = $data['items']; // array de items que recibimos por JSON
                    
                    foreach ($itemsData as $itemData) {
                        $item = new MercadoPago\Item();
                        $item->title = $itemData['title'];  // Título del producto
                        $item->quantity = $itemData['quantity'];  // Cantidad
                        $item->unit_price = $itemData['unit_price'];  // Precio unitario
                        
                        array_push($productos, $item);
                    }
                    
                    $preference->items = $productos;
                    $preference->save();

                    echo json_encode(["preference_id" => $preference->id]);
                    
                } else {
                    // Maneja el caso en que 'items' no está presente en el JSON
                    echo "Error: No se recibieron los datos de los productos.";
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
                $CategoriesController->handleRequest('categories'); // Maneja la solicitud sin ID
            } elseif (isset($path[2])) {
                $categoryId = $path[2];
                $CategoriesController->handleRequest('categories',$categoryId); // Maneja la solicitud con ID
            } else {
                echo json_encode(["message" => "Ruta no válida"]);
            }
            break;

            case 'insertcategorie':
                $CategoriesController = new CategoriesController($conn);
                $CategoriesController->handleRequest('insertcategorie');
            break;
            case 'deletecategorie':
                $CategoriesController = new CategoriesController($conn);
                $CategoriesController->handleRequest('deletecategorie');
            break;
            case 'updatecategorie':
                $CategoriesController = new CategoriesController($conn);
                $CategoriesController->handleRequest('updatecategorie');
            break;
            case 'activatecategorie':
                $CategoriesController = new CategoriesController($conn);
                $CategoriesController->handleRequest('activatecategorie');
            break;
            case 'getremovedcategories':
                $CategoriesController = new CategoriesController($conn);
                $CategoriesController->handleRequest('getremovedcategories');
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
            case 'deletedingredient':
                $IngredientsController = new IngredientsController($conn);
                $IngredientsController->handleRequest('deletedingredient');
                break;

            case 'insertingredient':
                $IngredientsController = new IngredientsController($conn);
                $IngredientsController->handleRequest('insertingredient');
                break;
            
            case 'updateingredient':
                $IngredientsController = new IngredientsController($conn);
                $IngredientsController->handleRequest('updateingredient');
                break;
            case 'deleteingredient':
                $IngredientsController = new IngredientsController($conn);
                $IngredientsController->handleRequest('deleteingredient');
                break;
            case 'activateingredient':
                $IngredientsController = new IngredientsController($conn);
                $IngredientsController->handleRequest('activateingredient');
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
                } else if ($path[2] === 'deletecustomers') {
                        $UserController->handleRequest('deletecustomers');
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
                }else if($path[2] === 'detailorder' && isset($path[3])){
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
                        case 'checkemail': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('checkemail');
                        break;
                        case 'resetpassword': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('resetpassword');
                        break;
                        case 'deleteaddress': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('deleteaddress');
                        break;
                        case 'getpassword': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('checkpassword');
                        break;
                        case 'updatepassword': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('checkpassword');
                        break;
                        case 'updatename': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('updatename');
                        break;
                        case 'deleteproduct': 

                            $ProductController = new ProductController($conn);
                            $ProductController->handleRequest('deleteproduct');
                        break;
                        case 'deleteemployee': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('deleteemployee');
                        break;
                        case 'cancelorder': 

                            $OrderController = new OrderController($conn);
                            $OrderController->handleRequest('cancelorder');
                        break;
                        case 'updateemployee': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('updateemployee');
                        break;
                        case 'addemployee': 

                            $UserController = new UserController($conn);
                            $UserController->handleRequest('addemployee');

                        break;

                        case 'inserttable': 

                            $TablesController = new TablesController($conn);
                            $TablesController->handleRequest('inserttable');
                            break;

                        case 'updatetable':
                            $TablesController = new TablesController($conn);
                            $TablesController->handleRequest('updatetable');
                            break;

                        case 'updateproduct':
                            $ProductController = new ProductController($conn);
                            $ProductController->handleRequest('updateproduct');
                            break;  
                            
                        case 'cancelreservation':
                            $ReservationController = new ReservationController($conn);
                            $ReservationController->handleRequest('cancelreservation');
                            break;  

                            case 'getreservation':
                                $ReservationController = new ReservationController($conn);
                                $ReservationController->handleRequest('getreservation');
                                break;
                            
                        case 'contactus':
                            $TokenController = new TokenController($conn);
                            $TokenController->handleRequest('contactus');
                            break;   

                        case 'reports':
                            if(isset($path[2]) && $path[2] === 'columnsdb') {
                                $ReportsController = new ReportsController($conn);
                                $ReportsController->handleRequest($path[2]);
                            } else {
                                echo json_encode(["message" => "Ruta no válida"]);
                            }
                        break;

                        case 'updateorderstatus':
                                                   
                                $OrderController = new OrderController($conn);
                                $OrderController->handleRequest('updateorderstatus');

                        break;

                        case 'ingredientsperproduct':
                            $OrderController = new OrderController($conn);
                            $OrderController->handleRequest('ingredientsperproduct', $path[2], $path[3], null, $path[4]);
                            break;

                        case 'getremovedemployees':
                            $UserController = new UserController($conn);
                            $UserController->handleRequest('getremovedemployees');
                          break;
                         case 'activateemployee':
                        $UserController = new UserController($conn);
                        $UserController->handleRequest('activateemployee');
                        break;
                        case 'getremovedproducts':
                            $ProductController = new ProductController($conn);
                            $ProductController->handleRequest('getremovedproducts');
                            break;                  
                        case 'activateproduct':
                            $ProductController = new ProductController($conn);
                            $ProductController->handleRequest('activateproduct');
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