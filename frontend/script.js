document.addEventListener("DOMContentLoaded", () => {
  const guessInput = document.getElementById("guessInput");
  const guessButton = document.getElementById("guessButton");
  const restartButton = document.getElementById("restartButton");
  const message = document.getElementById("message");
  const attemptsDisplay = document.getElementById("attempts");
  const scoreDisplay = document.getElementById("score");

  // Start joc nou la încărcare
  fetch("http://localhost:5000/start")
    .then((response) => {
      if (!response.ok) throw new Error("Server error");
      return response.json();
    })
    .then((data) => (message.textContent = data.message))
    .catch((error) => (message.textContent = "Error starting game!"));

  guessButton.addEventListener("click", () => {
    const guess = Number(guessInput.value);
    if (guess < 1 || guess > 100) {
      message.textContent = "Please enter a number between 1 and 100!";
      return;
    }

    fetch("http://localhost:5000/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
      })
      .then((data) => {
        attemptsDisplay.textContent = `Attempts: ${data.attempts}`;
        if (data.result === "correct") {
          message.textContent = "Congratulations! You guessed it!";
          scoreDisplay.textContent = `Score: ${data.score}`;
          guessButton.disabled = true;
        } else if (data.result === "too_low") {
          message.textContent = "Too low! Try again.";
        } else {
          message.textContent = "Too high! Try again.";
        }
      })
      .catch((error) => (message.textContent = "Error submitting guess!"));
  });

  restartButton.addEventListener("click", () => {
    fetch("http://localhost:5000/start")
      .then((response) => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
      })
      .then((data) => {
        message.textContent = data.message;
        attemptsDisplay.textContent = "Attempts: 0";
        scoreDisplay.textContent = "Score: -";
        guessButton.disabled = false;
        guessInput.value = "";
      })
      .catch((error) => (message.textContent = "Error restarting game!"));
  });
});
