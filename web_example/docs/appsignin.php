<?php

$servername = "localhost";
$username = "root";
$password = "project";
$db = "myproject";

   $conn=mysqli_connect("localhost","root","project","db");

   if (mysqli_connect_errno($conn)) {
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
   }
	
   $username = $_POST['username'];
   $password = $_POST['password'];
   $result = mysqli_query($con,"SELECT Role FROM table1 where 
   Username='$username' and Password='$password'");
   $row = mysqli_fetch_array($result);
   $data = $row[0];

   if($data){
      echo $data;
   }
	
   mysqli_close($con);
?>