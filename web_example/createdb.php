<?php 

$dbServername = "localhost";
$dbUsername = "root";
$dbPassword = "project";

//Create connection
$conn = mysqli_connect($dbServername, $dbUsername, $dbPassword);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//Create database
$sql = "CREATE DATABASE mystore";
if ($conn->query($sql) === TRUE) {
  echo "Database created successfully";
} else {
  echo "Error creating database: " . $conn->error;
}

$conn->close();

?>
