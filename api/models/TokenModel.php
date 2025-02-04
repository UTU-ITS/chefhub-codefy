<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php'; 
class TokenModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function generarToken($length = 6) {
        return substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, $length);
    }

    public function InsertToken($email, $token) {
        try {
            $stmt = $this->conn->prepare("INSERT INTO token (email, token, fecha_creacion) VALUES (:email, :token, NOW())");
            $stmt->execute(['email' => $email, 'token' => $token]);
        } catch (PDOException $e) {
            die("Error al insertar el token: " . $e->getMessage());
        }
    }


    public function sendMail($email, $token){
        $mail = new PHPMailer(true);
        try {

            $mail->isSMTP();
            $mail->Host = 'pro.turbo-smtp.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'codefy.supp@gmail.com';
            $mail->Password = '0ItA6otK';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
        
            $mail->setFrom('codefy.supp@gmail.com', 'Equipo de soporte');
            $mail->addAddress($email);
            $mail->Subject = 'Tu código de verificación';
            $mail->isHTML(true);
            $mail->Body = "<p>Hola,</p>
                           <p>Tu código de verificación es: <strong>$token</strong></p>
                           <p>Este código expirará en 10 minutos.</p>
                           <p>Si no has solicitado este código, ignora este mensaje.</p>";
        
            $mail->send();
            echo json_encode(["success"=>true, "message" => "Correo enviado exitosamente"]);
        } catch (Exception $e) {
            echo json_encode(["message" => "Error al enviar el correo: {$mail->ErrorInfo}"]);
        }
    }




    public function checkToken($email, $token) {
        $sql = "SELECT * FROM token WHERE email = :email 
                ORDER BY fecha_creacion DESC LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $latestToken = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // Verifica si existe un token y si coincide con el que se envió como parámetro
        if ($latestToken && $latestToken['token'] === $token) {
            return $latestToken;
        }
    
        return null; // Retorna null si no hay coincidencia
    }
}