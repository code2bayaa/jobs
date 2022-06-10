<?php
$host="localhost:3306";
$user="root";
$pwd="loyaltyband";

$myconn=mysqli_connect($host,$user,$pwd);
if(!$myconn)
{
echo "Connection to database server failed";
}
else
echo "Connection to database server established<br>";

//select the database
$mydb= mysqli_select_db($myconn,'myproject');
if(! $mydb ) 
{
  die('Could not select database: ' . mysqli_error($myconn));
}
  echo "Database myproject selected successfully\n";

mysqli_close($myconn);

?>


















