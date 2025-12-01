document.addEventListener("DOMContentLoaded", () => {
  const fractions = [
    {num: 1, den: 2}, {num: 1, den: 3}, {num: 1, den: 4}, {num: 1, den: 6},
    {num: 1, den: 5}, {num: 1, den: 7}, {num: 3, den: 8}, {num: 2, den: 9},
    {num: 5, den: 10}, {num: 7, den: 12}, {num: 11, den: 40}, {num: 7, den: 8},
    {num: 5, den: 6}, {num: 4, den: 25}, {num: 9, den: 11}, {num: 13, den: 20}
  ];

  let currentFraction = null;
  let score = 0;

  const elFraction = document.getElementById("fraction");
  const elResult = document.getElementById("result");
  const elExplain = document.getElementById("explain");
  const elScore = document.getElementById("score");
  const btnRecurring = document.getElementById("btn-recurring");
  const btnNonRecurring = document.getElementById("btn-nonrecurring");
  const btnCredits = document.getElementById("btn-credits");
  const modal = document.getElementById("creditsModal");
  const modalClose = document.getElementById("credits-close");
  const themeSelect = document.getElementById("theme");
  const volumeSlider = document.getElementById("volume");

  // Sound helper
  function playSound(id) {
    const audio = document.getElementById(id);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }

  function gcd(a, b) {
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return Math.abs(a);
  }
  function reduceFraction(num, den) {
    const g = gcd(num, den);
    return { num: num / g, den: den / g };
  }
  function isRecurringDenominator(den) {
    while (den % 2 === 0) den /= 2;
    while (den % 5 === 0) den /= 5;
    return den !== 1;
  }

  function nextQuestion() {
    const f = fractions[Math.floor(Math.random() * fractions.length)];
    currentFraction = reduceFraction(f.num, f.den);
    elFraction.innerText = `${currentFraction.num}/${currentFraction.den}`;
    elResult.innerText = "";
    elExplain.innerText = "";
  }

  function checkAnswer(answer) {
    if (!currentFraction) return;
    const recurring = isRecurringDenominator(currentFraction.den);
    const correctAnswer = recurring ? "recurring" : "non-recurring";

    if (answer === correctAnswer) {
      score++;
      elResult.innerText = "✅ Correct!";
      playSound("sound-correct");
    } else {
      score--;
      elResult.innerText = `❌ Wrong! Correct was ${correctAnswer}`;
      playSound("sound-wrong");
    }

    elScore.innerText = `Score: ${score}`;
    elExplain.innerText = recurring
      ? "Recurring: denominator has prime factors beyond 2 and/or 5."
      : "Non-recurring: denominator has only 2 and/or 5 as prime factors.";

    setTimeout(nextQuestion, 1200);
  }

  btnRecurring.addEventListener("click", () => checkAnswer("recurring"));
  btnNonRecurring.addEventListener("click", () => checkAnswer("non-recurring"));

  // Credits modal
  function showCredits() {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
  }
  function closeCredits() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
  btnCredits.addEventListener("click", showCredits);
  modalClose.addEventListener("click", closeCredits);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeCredits();
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "r") checkAnswer("recurring");
    else if (key === "n") checkAnswer("non-recurring");
    else if (key === "c") showCredits();
    else if (event.key === "Escape") closeCredits();
  });

  // Theme selector
  function applyTheme(theme) {
    document.body.class
