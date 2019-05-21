let cardImages = [
  "./images/boot.png",
  "./images/chalice.png",
  "./images/krug.png",
  "./images/kwak.png",
  "./images/pilsner.png",
  "./images/pint.png",
  "./images/pokal.png",
  "./images/snifter.png",
  "./images/stange.png",
  "./images/stein.png",
  "./images/tankard.png",
  "./images/tulip.png",
  "./images/weizen.png",
];

let backFaceImage = "./images/checkerboard.png";

let matched = [];

let clicks = 0;
let counter = document.getElementsByClassName("clicks")[0];

let hasFlippedCard = false;
let lock = false;
let firstCard, secondCard;

window.onload = startGame();


function shuffle(arr) {
    var i, j, temp;
    let shuffledArr = arr.slice();
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = shuffledArr[i];
        shuffledArr[i] = shuffledArr[j];
        shuffledArr[j] = temp;
    }
    return shuffledArr;
}


function selectAndShuffle() {
  let shuffledImages = shuffle(cardImages).splice(0, 6);
  let frontImages = shuffledImages.concat(shuffledImages);
  let shuffledFrontFaces = shuffle(frontImages);
  return shuffledFrontFaces;
}


function deckSetup(cards) {
  let frontFaceImages = selectAndShuffle();
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    card.id = i;

    let backFace = card.getElementsByClassName("back-face")[0];
    backFace.setAttribute("src", backFaceImage);

    let frontFace = card.getElementsByClassName("front-face")[0];
    frontFace.setAttribute("src", frontFaceImages[i]);

    card.classList.remove('flip');
  }
}


function flipCard() {
  if (lock) { return; }

  this.classList.add('flip');
  if (!hasFlippedCard) {
    clicks++;
    firstCard = this;
    hasFlippedCard = true;
    displayCounter();
    return;
  }

  if (this.id !== firstCard.id) {
    clicks++;
    secondCard = this;
    hasFlippedCard = false;
    displayCounter();
    checkMatch();
  }

  checkFinished();
}

function displayCounter() {
  counter.innerHTML = clicks;
}

function unflipCards() {
  lock = true;
  setTimeout(() => {
     firstCard.classList.remove('flip');
     secondCard.classList.remove('flip');

     lock = false;
   }, 800);
}

function disableCard() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
}

function checkMatch() {
  let firstCardID = firstCard.getElementsByClassName('front-face')[0].getAttribute('src');
  let secondCardID = secondCard.getElementsByClassName('front-face')[0].getAttribute('src');

  if (firstCardID === secondCardID) {
    matched.push(firstCard, secondCard);
    disableCard();
  } else {
    unflipCards();
  }
}

function checkFinished() {
  if (matched.length === 12) {
    displayWinModal();
    storeBestScore();
  }
}

function storeBestScore() {
  let bestScore = localStorage.getItem('bestScore'); 
  if (bestScore === null || clicks < bestScore) {
    localStorage.setItem("bestScore", JSON.stringify(clicks));
  }
  let recordedBestScore = document.getElementsByClassName("recorded-best-score")[0];
  recordedBestScore.innerText = JSON.parse(localStorage.getItem("bestScore"));
}


function displayWinModal() {
  lock = true;
  setTimeout(() => {
    let popup = document.getElementsByClassName("popup")[0];
    popup.style.display = "flex";

    lock = false;
  }, 800);
}

function startGame() {
  let cards = document.getElementsByClassName("card");
  deckSetup(cards);

  for (let card of cards) {
    card.addEventListener('click', flipCard);
  }
}


function playAgain() {
  lock = false;
  clicks = 0;
  hasFlippedCard = false;
  matched = [];
  firstCard = null;
  secondCard = null;

  counter.innerText = "__";

  let hidePopup = document.getElementsByClassName("popup")[0];
  hidePopup.style.display = "none";

  startGame();
}
