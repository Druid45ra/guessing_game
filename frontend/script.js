document.addEventListener("DOMContentLoaded", () => {
  const guessInput = document.getElementById("guessInput");
  const guessButton = document.getElementById("guessButton");
  const restartButton = document.getElementById("restartButton");
  const message = document.getElementById("message");
  const attemptsDisplay = document.getElementById("attempts");
  const scoreDisplay = document.getElementById("score");

  // Start new game on load
  fetch("http://localhost:5000/start")
    .then((response) => response.json())
    .then((data) => (message.textContent = data.message));

  guessButton.addEventListener("click", () => {
    const guess = parseInt(guessInput.value, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      message.textContent = "Please enter a number between 1 and 100!";
      return;
    }

    fetch("http://localhost:5000/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    })
      .then((response) => response.json())
      .then((data) => {
        attemptsDisplay.textContent = `Attempts: ${data.attempts}`;
        if (data.result === "correct") {
          message.textContent = `Congratulations! You guessed it!`;
          scoreDisplay.textContent = `Score: ${data.score}`;
          guessButton.disabled = true;
        } else if (data.result === "too_low") {
          message.textContent = "Too low! Try again.";
        } else {
          message.textContent = "Too high! Try again.";
        }
      });
  });

  restartButton.addEventListener("click", () => {
    fetch("http://localhost:5000/start")
      .then((response) => response.json())
      .then((data) => {
        message.textContent = data.message;
        attemptsDisplay.textContent = "Attempts: 0";
        scoreDisplay.textContent = "Score: -";
        guessButton.disabled = false;
        guessInput.value = "";
      });
  });
});
