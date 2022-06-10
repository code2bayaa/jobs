<html lang="en">

	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<meta http-equiv="X-UA-Compatible" content="ie=edge"/>
		
		<link rel="stylesheet" href="index.css"/>
		<title>Welcome to Careers' Kitty</title>
	<head>
	
<body>
<div class="container" id="container">

	<!--Sign-Up Container-->
	<div class="form-container sign-up-container">
		<form method="POST" action="signup.php">
			<h1>Create Account</h1>
			<br><br>
			<span>Enter your info below</span>
			<br>
			<input type="text" placeholder="Name" name = "name"/>
			<input type="text" placeholder="Create a username" name = "username"/>
			<input type="email" placeholder="Email" name = "email"/>
			<input type="password" placeholder="Password" name = "password"/>
			<br>
			<button>Sign Up</button>
		</form>
	</div>
	
	<!--Sign-In Container-->
	<div class="form-container sign-in-container">
		<form action="signin.php">
			<h1>Sign in<br>to your Account</h1>
			<br><br>
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<br>
			<a href="#">Forgot your password?</a>
			<button>Sign In</button>
		</form>
	</div>
	
	<!--Overlay Containers-->
	<div class="overlay-container">
		<div class="overlay">
			<div class="overlay-panel overlay-left">
				<h1>Careers' Kitty</h1>
				<span>Join us & build your career</span>
				<h1>Welcome back!</h1>
				<p>Sign in to remain connected</p>
				<button class="ghost" id="signIn">Sign In</button>
			</div>
			<div class="overlay-panel overlay-right">
				<h1>Careers' Kitty</h1>
				<span>Join us & build your career</span>
				<h1>Hello there!</h1>
				<p>Create account and start your journey<br>
				with us</p>
				<button class="ghost" id="signUp">Sign Up</button>
			</div>
		</div>
	</div>
	
</div> 

<script src="index.js"></script>
</body>

</html>