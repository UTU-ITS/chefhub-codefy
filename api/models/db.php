<?php
	/**
	* Database Connection
	*/
	class DbConnect {
		private $server = '192.168.0.2:3306';
		private $dbname = 'chefhub_db';
		private $user = 'root';
		private $pass = 'root';

		public function connect() {
			try {
				$conn = new PDO('mysql:host=' .$this->server .';dbname=' . $this->dbname, $this->user, $this->pass);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				return $conn;
			} catch (\Exception $e) {
				echo "Database Error: " . $e->getMessage();
			}
		}
        
	}
?>