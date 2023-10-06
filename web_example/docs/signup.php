<?php

require_once('connect.php');

//-------//

//Pick form data
$name=$_POST['name'];
$username=$_POST['username'];
$email=$_POST['email'];
$password=md5($_POST['password']);

//Check if user already exists
$checkusername = mysqli_query($conn,"SELECT * FROM attendants WHERE 
Username = '".$username."'"); 

//Set above selection as result for mysqli_num_rows
$result = mysqli_query($db, $checkusername);

//If user name exist generate error message
if(mysqli_num_rows($result) > 0)
	{
		echo "<h1>Error</h1>";
		echo "<p>Username already taken Create another username.</p>";
	}
	else
	{
//Insert new attendant details into table Attendants
$registerquery = mysqli_query("INSERT INTO attendants (Name, Username, Email, Password)
	VALUES('$name','$username','$email','".md5($password)."');
 
 ?>