<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");


include 'db.php';
$db= new DbConnect();
$conn = $db->connect();


$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    
    case "POST":
        $user = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO login_log (email, pass) VALUES( :email, :pass)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':pass', $user->pass);


        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;


    }