let currentQuestion = 0;
let score = 0;
let questions = [];

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game").style.display = "block";

  fetch("data/sorular.json")
    .then(response => response.json())
    .then(data => {
      questions = data;
      currentQuestion = 0;
      score = 0;
      showQuestion();
    });
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
	  const percentage = Math.round(score);

	  let title = "";
	  let message = "";
	  
	  if (percentage <= 20) {
	    title = "🪑 Yeni Kabineye Aday Gösterilmedin";
	    message = "Siyasi kariyerin daha başlamadan bitti. CV'ni mülakata getirmeyi unutmuşsun 😅";
	  } else if (percentage <= 40) {
	    title = "🗂️ Danışman Torpillisi";
	    message = "Torpille gelmişsin ama sorular seni hemen ele verdi. Biraz daha oku, sonra gel.";
	  } else if (percentage <= 60) {
	    title = "📌 Taşeron Bakan";
	    message = "Bakan oldun ama 6 ay sonra görevden alındın. Basın açıklamasını hâlâ bekliyoruz.";
	  } else if (percentage <= 80) {
	    title = "🧳 Yedek Bakan";
	    message = "Asıl bakan yurt dışındayken yerine baktın. Makam aracını geri verirken zorlandın... 🚗💨";
	  } else if (percentage < 100) {
	    title = "🎯 Favori Bakan Adayı";
	    message = "Seçim otobüsün yola çıktı, rozetin takıldı. Ama tam koltuk geliyordu ki biri torpil yaptı! 💥";
	  } else {
	    title = "👑 Gerçek Bakan Sensin!";
	    message = "Tüm soruları bildin. Kabine seni bekliyor! Ama önce bir basın toplantısı, bir de X hesabı açman gerek! 🧑‍💼📢";
	  }


	  document.getElementById("game").innerHTML = `
	  <h2>Oyun Bitti!</h2>
	  <p>Skorun: <strong>${score}</strong>%</p>
	  <p class="result-title">${title}</p>
	  <p class="result-message">${message}</p>
	  <button onclick="restartGame()">Tekrar Dene</button>
	  `;
	  return;
	}


  const q = questions[currentQuestion];
  document.getElementById("question-image").src = q.image;

  const questionNumber = currentQuestion + 1;
  const totalQuestions = questions.length;
  document.getElementById("progress-text").textContent = `${questionNumber}/${totalQuestions}`;
  const progressPercent = (questionNumber / totalQuestions) * 100;
  document.getElementById("progress-fill").style.width = `${progressPercent}%`;

  const choicesDiv = document.getElementById("choices");
  const feedback = document.getElementById("feedback");
  feedback.style.display = "none";
  choicesDiv.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;

    if (q.choices.length % 2 === 1 && index === q.choices.length - 1) {
      btn.style.gridColumn = "span 2";
      btn.style.justifySelf = "center";
    }

    btn.onclick = () => {
	  const allButtons = choicesDiv.querySelectorAll("button");
	  allButtons.forEach(b => b.disabled = true);

	  const correctButton = [...allButtons].find(b => b.textContent === q.correct);

	  if (choice === q.correct) {
		score += 100 / (totalQuestions + 1);
		blinkButton(correctButton, "#28a745");
		feedback.style.display = "none";
		setTimeout(() => {
		  currentQuestion++;
		  showQuestion();
		}, 1000);
	  } else {
		btn.classList.add("wrong");

		blinkButton(correctButton, "#28a745");

		feedback.textContent = `Cevabın yanlış. Doğru cevap: ${q.correct}`;
		feedback.style.display = "block";

		setTimeout(() => {
		  currentQuestion++;
		  showQuestion();
		}, 1800);
	  }

	  document.getElementById("score").textContent = `Skor: ${Math.round(score)}`;
	};



    choicesDiv.appendChild(btn);
  });
}

function blinkButton(button, color) {
  let count = 0;
  const originalColor = button.style.backgroundColor;

  const interval = setInterval(() => {
    button.style.backgroundColor = count % 2 === 0 ? color : originalColor;
    count++;

    if (count > 5) {
      clearInterval(interval);
      button.style.backgroundColor = color; // sabit yeşilde bırak
      button.style.color = "white";
    }
  }, 200);
}

function restartGame() {
  location.reload();
}