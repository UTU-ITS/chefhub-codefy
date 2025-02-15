<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir base de datos y modelo
include dirname(__DIR__) .'/models/PreferenceModel.php';

class PreferenceController {
    private $preference;

    public function __construct() {
        $db = new DbConnect();
        $conn = $db->connect();
        $this->preference = new PreferenceModel($conn);  // Instancia del modelo Table, no el controlador
    }

    public function handleRequest($action) {
        $method = $_SERVER['REQUEST_METHOD'];
    
        switch ($method) {
            case "GET":
                try {

                    $response = $this->preference->getPreferences();
            
                    if ($response) {
                    
                        echo json_encode(["data" => $response], JSON_UNESCAPED_UNICODE);
                        http_response_code(200); 
                    } else {
                    
                        echo json_encode(["message" => "No se encontraron datos"]);
                        http_response_code(404); 
                    }
                } catch (Exception $e) {
                    echo json_encode(["message" => "Error en la consulta: " . $e->getMessage()]);
                    http_response_code(500); 
                }
                break;
            

                case "PUT":
                    if ($action == "updatepreferences") {
                        $data = json_decode(file_get_contents('php://input'), true);
                
                        // Comprobar que los datos contienen la lista de preferencias para cada día
                        if (isset($data['preferences']) && is_array($data['preferences'])) {
                            // Recorrer cada día de la semana y actualizar las preferencias
                            foreach ($data['preferences'] as $day) {
                                // Verificar que los datos necesarios estén presentes
                                if (isset($day['dia_semana'], $day['horario_apertura'], $day['horario_cierre'], $day['duracion_reserva'])) {
                                    $response = $this->preference->UpdatePreference(
                                        $day['dia_semana'],
                                        $day['horario_apertura'],
                                        $day['horario_cierre'],
                                        $day['duracion_reserva']
                                    );
                
                                    if (!$response) {
                                        echo json_encode(["message" => "Error al actualizar los datos para el día " . $day['dia_semana']]);
                                        return;
                                    }
                                } else {
                                    echo json_encode(["message" => "Datos incompletos para el día " . $day['dia_semana']]);
                                    return;
                                }
                            }
                            
                            // Si todo se actualizó correctamente
                            echo json_encode(["success" => true, "message" => "Datos actualizados correctamente"]);
                        } else {
                            echo json_encode(["message" => "Datos de preferencias no válidos"]);
                        }
                    } else {
                        echo json_encode(["message" => "Acción no permitida"]);
                    }
                    break;
                
            default:
                echo json_encode(["message" => "Método no soportado"]);
                break;
        }
    
    }
}
