/* Affichage du graphique */
var chart; // Maintient une instance du graphique
var chartSVG; // Maintient une instance de l'image et de ses données

nv.addGraph(function () {
  chart = nv.models.scatterChart()
    .showLegend(false)
    .pointShape("circle")
    .pointRange([50, 50]);

  chart.xAxis.ticks(0).tickFormat(d3.format('.01f'));
  chart.yAxis.ticks(0).tickFormat(d3.format('.01f'));
  chart.tooltip.enabled(false);
  //chart.interactive(false);

  chartSVG = d3.select('#correlatedChart svg')
    .datum(generateCorrelatedSample());

  chartSVG
    .transition()
    .duration(500)
    .call(chart)

  nv.utils.windowResize(chart.update);

  return chart;
});

function updateGraph() {
  chartSVG
    .datum(generateCorrelatedSample())
    .transition()
    .duration(500)
    .call(chart);

  nv.utils.windowResize(chart.update);
}

/* Calcul du graphique */
var trueR;

function generateCorrelatedSample() {
  // Calcul de la série de données
  trueR = Math.random();
  var meanVector = [0, 0];
  var covarianceMatrix = [
    [1.0, trueR],
    [trueR, 1.0],
  ];
  var distribution = window.MultivariateNormal.default(meanVector, covarianceMatrix);

  // Récupération des coordonnées
  var coordinates = [];
  coordinates.push({
    color: "#8F3433",
    values: []
  });

  for (var i = 0; i < 250; i++) {
    var currentSample = distribution.sample();
    coordinates[0].values.push({
      x: currentSample[0],
      y: currentSample[1]
    });
  }

  return coordinates;
}

/* Récupération de la réponse utilisateur et calcul du score */
var lives = 3,
  score = 0,
  streak = 0,
  meanError = 0,
  n = 0;

function calcMeanError(guessedR, roundedR) {
  meanError += Math.abs(guessedR - roundedR) / n;
  document.getElementById("meanError").innerText = meanError.toFixed(2);
}

function getRandomWin(goodAnswer) {
  var items = ["Félicitations !",
    "Exact !",
    "Bien joué !",
    "Vous devriez devenir prof de maths !",
    "Polytechnique souhaiterait connaître votre localisation."
  ];
  document.getElementById("replyText").innerText = items[Math.floor(Math.random() * items.length)] + " La vraie valeur était : " + goodAnswer + ".";
}

function getRandomNorWinNorFail(goodAnswer) {
  var items = ["Peut mieux faire.",
    "Mouais.",
    "Continuez à vous entraîner !",
    "C'est presque ça."
  ];
  document.getElementById("replyText").innerText = items[Math.floor(Math.random() * items.length)] + " La vraie valeur était : " + goodAnswer + ".";
}

function getRandomFail(goodAnswer) {
  var items = ["Raté !",
    "Essayez encore.",
    "À côté de la plaque !",
    "C'est pas encore ça."
  ];
  document.getElementById("replyText").innerText = items[Math.floor(Math.random() * items.length)] + " La vraie valeur était : " + goodAnswer + ".";
}

function getGameoverText() {
  var beginningText = "Vous avez récupéré " + score + " étoiles";
  var addPseudoText = "Saisissez votre pseudo pour ajouter votre score au classement :";
  if (score <= 20) {
    document.getElementById("result").innerText = beginningText + ". Vous devriez aller jeter un coup d'œil aux règles ! " + addPseudoText;
  } else if (score > 20 && score < 50) {
    document.getElementById("result").innerText = beginningText + ", pas mal du tout ! " + addPseudoText;
  } else if (score > 100 && score < 1000) {
    document.getElementById("result").innerText = beginningText + ". Waouh, les corrélations n'ont plus de secret pour vous ! " + addPseudoText;
  } else if (score >= 1000) {
    document.getElementById("result").innerText = beginningText + ". Soit vous avez triché, soit vous êtes le meilleur des meilleurs ! " + addPseudoText;
  }
}

function addScore(scoreToAdd, streak) {
  var newScoreToAdd = scoreToAdd + streak;
  score += newScoreToAdd;
  document.getElementById("starRecap").innerHTML = "+" + newScoreToAdd + " <i class='fa fa-star'></i>";
  document.getElementById("score").innerText = score;
}

function addLives(value) {
  for (i = 0; i < value; i++) {
    if (!(lives === 4)) {
      lives += 1;
      document.getElementById("life" + lives).setAttribute("class", "fa fa-heart");
    }
  }
  document.getElementById("healthRecap").innerHTML = "+" + value + " <i class='fa fa-heart'></i>";
}

function removeLives(value) {
  for (i = 0; i < value; i++) {
    document.getElementById("life" + lives).setAttribute("class", "fa fa-heart-o");
    lives -= 1;
  }
  document.getElementById("healthRecap").innerHTML = "-" + value + " <i class='fa fa-heart'></i>";
}

function checkAnswer() {
  var guessedR = document.getElementById("guessedR").value,
    roundedR = Number(trueR.toFixed(2));
  if (guessedR < 0 || guessedR > 1) {
    alert("Vous devez saisir une valeur comprise entre 0 et 1.");
  } else {
    if (guessedR == roundedR) {
      addScore(10, streak);
      addLives(2);
      getRandomWin(roundedR);
      streak += 1;
      document.getElementById("streak").innerText = streak;
    } else if (guessedR <= roundedR + 0.05 && guessedR >= roundedR - 0.05) {
      addScore(5, streak);
      addLives(1);
      getRandomWin(roundedR);
      streak += 1;
      document.getElementById("streak").innerText = streak;
    } else if (guessedR <= roundedR + 0.10 && guessedR >= roundedR - 0.1) {
      addScore(1, streak);
      getRandomNorWinNorFail(roundedR);
      streak = 0;
      document.getElementById("streak").innerText = streak;
    } else {
      removeLives(1);
      getRandomFail(roundedR);
    }
    n += 1;
    calcMeanError(guessedR, roundedR);
    updateGraph()
  }

  if (lives <= 0) {
    document.getElementById("game").setAttribute("hidden", "");
    document.getElementById("game-over").removeAttribute("hidden");
    getGameoverText();
    document.userScore.userScore.value = score;
  }
}

function checkKeyPress(event) {
  event = event || window.event;
  if (event.keyCode === 13) {
    checkAnswer();
  }
}

function redirectToRules() {
  if (confirm("Attention, cela va entraîner l'arrêt de cette partie. Voulez-vous continuer ?")) {
    window.location.href = "rules.html";
  }
}

function redirectToMenu() {
  if (confirm("Attention, cela va entraîner l'arrêt de cette partie. Voulez-vous continuer ?")) {
    window.location.href = "menu.html";
  }
}