<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir base de datos y modelo
include dirname(__DIR__) .'/models/TokenModel.php';

class TokenController {
    private $token;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->token = new TokenModel($conn); 
    }

    public function handleRequest($action) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
           
                case "POST":
                    if($action==='sendmail'){
                        $inputData = json_decode(file_get_contents('php://input'), true);
                        $email = $inputData['email'];
                        $token = $this->token->generarToken();
                        $this->token->InsertToken($email, $token);
                        $this->token->sendMail($email, $token);
                    } else if($action==='checktoken'){
                        $inputData = json_decode(file_get_contents('php://input'), true);
                        $email = $inputData['email'];
                        $tokenInput = $inputData['tokenInput'];
                        $result = $this->token->checkToken($email, $tokenInput);
                        if($result){
                            echo json_encode([ "success" => true, "message" => "Verificacion correcta"]);
                        }else{
                            echo json_encode(["message" => "Verificacion incorrecta"]);
                        }
                    }


                    
                    else{
                        echo json_encode(["message" => "Acción no válida"]);
                    }
                $inputData = json_decode(file_get_contents('php://input'), true);
                break;
    
            default:
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    
    }
}
