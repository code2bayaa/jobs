const continueButton = document.getElementById('continue');
const returnButton = document.getElementById('return');

continueButton.addEventListener('click', () => {
	form.classList.add("main.php");
});

returnButton.addEventListener('click', () => {
	form.classList.add("index.php");
});