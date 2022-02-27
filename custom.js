const getBoxItems = id => {
  return {
    card: document.querySelector(`.box#${id} .card`),
    before: document.querySelector(`.box#${id} .before .digits`),
    front: document.querySelector(`.box#${id} .card-face-front .digits`),
    back: document.querySelector(`.box#${id} .card-face-back .digits`),
    after: document.querySelector(`.box#${id} .after .digits`),
  };
};

const createHTMLBox = id => {
  const boxAsString = `
    <div class="box-container">
        <div id='${id}'  class="box">
            <div class="before">
                <div class="face-content">
                    <span class="hinge left-hinge"></span>
                    <span class="digits">00</span>
                    <span class="hinge right-hinge"></span>
                </div>
            </div>

            <div class="card">
                <div class="card-face card-face-front">
                    <div class="face-content">
                        <span class="hinge left-hinge"></span>
                        <span class="digits">00</span>
                        <span class="hinge right-hinge"></span>
                    </div>
                </div>

                <div class="card-face card-face-back">
                    <div class="face-content">
                        <span class="hinge left-hinge"></span>
                        <span class="digits">00</span>
                        <span class="hinge right-hinge"></span>
                    </div>
                </div>
            </div>

            <div class="after">
                <div class="face-content">
                    <span class="hinge left-hinge"></span>
                    <span class="digits">00</span>
                    <span class="hinge right-hinge"></span>
                </div>
            </div>
        </div>

        <span class="label">${id}</span>
    </div>
  `;

  return new DOMParser()
    .parseFromString(boxAsString, 'text/html')
    .querySelector('.box-container');
};

const getData = (current, date) => {
  const DIFF_IN_TIME = new Date(date).getTime() - new Date(current).getTime();

  const DIFF_IN_DAYS = DIFF_IN_TIME / (1000 * 60 * 60 * 24);
  let days = DIFF_IN_DAYS - (DIFF_IN_DAYS % 1);
  days = (days.toString().length <= 1 ? '0' : '') + days;

  const DIFF_IN_HOURS = (DIFF_IN_DAYS % 1) * 24;
  let hours = DIFF_IN_HOURS - (DIFF_IN_HOURS % 1);
  hours = (hours.toString().length <= 1 ? '0' : '') + hours;

  const DIFF_IN_MINUTES = (DIFF_IN_HOURS % 1) * 60;
  let minutes = DIFF_IN_MINUTES - (DIFF_IN_MINUTES % 1);
  minutes = (minutes.toString().length <= 1 ? '0' : '') + minutes;

  const DIFF_IN_SECONDS = (DIFF_IN_MINUTES % 1) * 60;
  let seconds = DIFF_IN_SECONDS - (DIFF_IN_SECONDS % 1);
  seconds = (seconds.toString().length <= 1 ? '0' : '') + seconds;

  return { days, hours, minutes, seconds };
};

const countdownTimer = (date, boxes) => {
  const current = new Date();

  if (current >= date) return 0;

  const timer = getData(current, date);

  Object.keys(timer).map(key => {
    const prevValue = boxes[key].front.innerHTML;
    const currentValue = timer[key];

    boxes[key].card.addEventListener('transitionend', () => {
      boxes[key].front.innerHTML = boxes[key].after.innerHTML = currentValue;
      boxes[key].card.classList.remove('flipped');
    });

    if (+prevValue != +currentValue) {
      boxes[key].before.innerHTML = boxes[key].back.innerHTML = currentValue;
      boxes[key].card.classList.add('flipped');
    }
  });
};

function app() {
  'use strict';

  const container = document.querySelector('.boxes-container');

  const date = new Date('1/1 19:00:00');
  date.setFullYear(new Date().getFullYear() + 1);

  const boxIDs = ['days', 'hours', 'minutes', 'seconds'];

  const boxes = {};

  boxIDs.forEach(id => {
    container.appendChild(createHTMLBox(id));
    boxes[id] = getBoxItems(id);
  });

  const countdownTimerHandler = setInterval(() => {
    if (countdownTimer(date, boxes) === 0) {
      clearInterval(countdownTimerHandler);
    }
  }, 1000);
}

app();
