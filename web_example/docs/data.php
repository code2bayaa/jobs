<html>
<body>

<?php

require_once('connect.php');

//Insert redords to Attendants
$mysqli = "INSERT INTO Attendants(ID, Name, Username, Email, Password)
		VALUES('101', 'Terry Shivachi', 'terryshivachi', 'terry@gmail.com', 'shiv1997')";
		
		
if ($myconn->multi_query($mysqli) === TRUE) {
 echo"Records added.";
} else {
 echo"Error: " . $mysqli . "<br>" . $myconn->error;
}

mysqli_close($myconn);
?>