<?php

require_once('connect.php');

//Create table Attendants
$mysqli = "CREATE TABLE Attendants (userID INT NOT NULL AUTO_INCREMENT,
		Name VARCHAR(20) NOT NULL DEFAULT '',
		Username VARCHAR(30) NOT NULL DEFAULT '',
		Email VARCHAR(30) NOT NULL DEFAULT '',
		Password VARCHAR(30) NOT NULL DEFAULT '',
		PRIMARY KEY (userID))";
		

if ($myconn->query($mysqli) === TRUE) {
 echo "Table Attendants created successfully.";
} else {
 echo "Error creating table: " . mysqli_error($myconn);
}

mysqli_close($myconn);
?>
