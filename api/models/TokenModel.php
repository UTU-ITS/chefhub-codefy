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
            echo json_encode(["message" => "Correo enviado exitosamente"]);
        } catch (Exception $e) {
            echo json_encode(["message" => "Error al enviar el correo: {$mail->ErrorInfo}"]);
        }
    }




    public function checkToken($email,$token) {
        $sql = "SELECT * FROM token WHERE token = :token AND email= :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}