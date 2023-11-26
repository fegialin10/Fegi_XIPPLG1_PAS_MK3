const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Item array permainan
const items = [
  { name: "anjing", image: "anjing.jpg" },
  { name: "babi", image: "babi.jpg" },
  { name: "beruang", image: "beruang.jpg" },
  { name: "gajah", image: "gajah.jpg" },
  { name: "jerapah", image: "jerapah.jpg" },
  { name: "kelinci", image: "kelinci.jpg" },
  { name: "musang", image: "musang.jpg" },
  { name: "panda", image: "panda.jpg" },
  { name: "rubah", image: "rubah.jpg" },
  { name: "rusa", image: "rubah.jpg" },
  { name: "serigala", image: "serigala.jpg" },
  { name: "singa", image: "singa.jpg" },
];

//Pengkondisian waktu
let seconds = 0,
  minutes = 0;
//pengkondisian moves dan kemenangan
let movesCount = 0,
  winCount = 0;

//pengaturan waktu
const timeGenerator = () => {
  seconds += 1;
  //logika menit
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format waktu sebelum mulai
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//menghitung jumlah moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//pick random item 
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  //inisialisasi card array
  let cardValues = [];
  size = (size * size) / 2;
  //Random objek
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }

  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Card
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        //flip kartu yang di klik
        card.classList.add("flipped");
        //pengkondisian kartu pertama di klik
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          //kartu kedua
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //jika card tidak cocok 
            //flip kartu balik kondisi awal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //kontrol button
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer waktu
  interval = setInterval(timeGenerator, 1000);
  //inisialisasi moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Inisialisasi value
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};