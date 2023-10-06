<?php

$host="localhost:3306";
$user="root";
$pwd="loyaltyband";
$dbname="myproject";

$myconn=mysqli_connect($host,$user,$pwd,$dbname);
if(!$myconn)
{
echo "Connection to database & server failed";
}
else
{
echo "Connection to database & server established<br>";
}

mysqli_close($myconn);

?>


















