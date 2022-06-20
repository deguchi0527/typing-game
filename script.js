/* 変数定義 */
const RANDOM_TEXT_API = "https://api.quotable.io/random";
const timer = document.getElementById("timer");
const typeDisplay = document.getElementById("typeDisplay");
const typeCorrect = document.getElementById("typeCorrect");

let startTime;
let originTime = 30;
let typed;
let untyped;

/* Audioインスタンスを生成 */
const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

/* 非同期でランダムな文章を取得する */
function GetRandomText() {
  return fetch(RANDOM_TEXT_API)
  .then((response) => response.json())
  .then((data) => data.content);
}

/* ランダムな文章を取得して、表示する */
async function RenderNextText() {
  const sentence = await GetRandomText();
  typeCorrect.innerText = "";
  typeDisplay.innerText = "";
  typeDisplay.innerText = sentence;

  typed = "";
  untyped = sentence;
  
  StartTimer();
}

/* タイマーを表示する */
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  RenderNextText();
}

function updateTextField() {
  typeCorrect.innerText = typed;
  typeDisplay.innerText = untyped;
}

/* キーが押されたときに発火するイベント */
document.addEventListener("keydown", function(e){
  if (e.key != untyped.substring(0, 1)) {
    wrongSound.play();
    wrongSound.currentTime = 0;
    return;
  }
  typeSound.play();
  typeSound.currentTime = 0;
  
  typed += untyped.substring(0, 1);
  untyped = untyped.substring(1);
  
  updateTextField();

  if (untyped == "") {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextText();
  }
});

RenderNextText();