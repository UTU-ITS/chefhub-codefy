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
            $mail->Subject = 'Chefhub 2FA - Codigo de verificacion';
            $mail->isHTML(true);
            $mail->Body = "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Verificación de Código</title>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #6a0dad;
            margin-bottom: 20px;
        }
        .code {
            font-size: 28px;
            font-weight: bold;
            color: #ab8ef4;
            background: #f3eaff;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 5px;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #333;
        }
        .footer {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>Código de Verificación</div>
        <p class='message'>Tu código de verificación es:</p>
        <div class='code'>$token</div>
        <p class='message'>Si no has solicitado este código, simplemente ignora este mensaje.</p>
        <p class='foote'>&copy; 2025 Codefy. Todos los derechos reservados.</p>
    </div>
</body>
</html>
";
        
            $mail->send();
            echo json_encode(["success"=>true, "message" => "Correo enviado exitosamente"]);
        } catch (Exception $e) {
            echo json_encode(["message" => "Error al enviar el correo: {$mail->ErrorInfo}"]);
        }
    }

    public function sendMailContactUs($email, $mensaje, $nombre)
{
    $mail = new PHPMailer(true);
    try {

        if (!$email) {
            echo json_encode(["success" => false, "message" => "Email inválido"]);
            exit;
        }

        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'pro.turbo-smtp.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'codefy.supp@gmail.com'; 
        $mail->Password = '0ItA6otK';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Configurar remitente y destinatario
        $mail->setFrom('codefy.supp@gmail.com', 'Equipo de soporte');
        $mail->addReplyTo($email, $nombre);
        $mail->addAddress('codefy.supp@gmail.com');
        
        // Configurar el contenido del correo
        $mail->Subject = 'Mensaje de ' . $nombre;
        $mail->isHTML(true);
        $mail->Body = "<p><strong>Nombre:</strong> $nombre</p>
                       <p><strong>Email:</strong> $email</p>
                       <p><strong>Mensaje:</strong><br>$mensaje</p>";

        // Enviar correo
        $mail->send();
        echo json_encode(["success" => true, "message" => "Correo enviado exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error al enviar el correo: {$mail->ErrorInfo}"]);
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