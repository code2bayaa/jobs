<html>
<body>

<style>
body {
  background-image: url('background.jpg');
  background-size: 100% 100%;
}
h1 {
  color: black;
  font-family: cursive;
  font-size: 150%;
  text-align: center;
}
h2 {
	color: black;
	font-family: cursive;
	font-size: 150%;
	text-align: center;
}
form {
border-radius: 25px;
width: 80%;
height: 80%;
background-color: white;
margin: 0 auto;
opacity: 100%;
}
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}

.CreateAccount {
  text-align: center;
  background-color: #f5f5f5;;
  font-size: 120%;
  font-family: cursive;
  color: black;
}
.LoginAccess {
	text-align: center;
	text-color: black;
}
</style>

<div class="grid-container"> /*Put divs side by side*/

<div class="CreateAccount">
<form method="POST" action="register.php">
	<h1>Create Account</h1>
	<label for="email">Email:</label><br>
	<input type="text" idname="email" name="email"><br>
	<label for="password">Password:</label><br>
	<input type="text" idname="password" name="password"><br><br> 
    <input type="submit" value="Sign Up"/><br><br>
</form>
</div>

<div class="LoginAccess">
	<h1>Careers' Kitty</h1>
	<h2>Welcome Back</h2>
	<p>To remain connected please login<br>with your personal details</p>
	<form action="login.php">
	<button>Log In</button>
	</form>
</div>

</div>

</body>
</html>
