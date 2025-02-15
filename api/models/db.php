<?php
require ('../vendor/autoload.php');
	
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

	class DbConnect {
		private $host;
		private $db;
		private $user;
		private $pass;

		public function __construct() {
			$this->host = $_ENV['DB_HOST'];
			$this->db = $_ENV['DB_NAME'];
			$this->user = $_ENV['DB_USER'];
			$this->pass = $_ENV['DB_PASS'];
			}

			public function connect() {
			try {
				$conn = new PDO('mysql:host=' .$this->host .';dbname=' . $this->db, $this->user, $this->pass);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				return $conn;
			} catch (\Exception $e) {
				echo "Database Error: " . $e->getMessage();
			}
		}
        
	}
	



?>