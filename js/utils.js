import { closeModal } from './store/modal-handler.js';

const getRandomInt = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const createRandomIdGenerator = (min, max) => {
  const previousValues = [];

  return function () {
    let currentId = getRandomInt(min, max);

    if (previousValues.length >= max - min + 1) {
      return null;
    }

    while (previousValues.includes(currentId)) {
      currentId = getRandomInt(min, max);
    }
    previousValues.push(currentId);
    return currentId;
  };
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const onDocumentKeydown = (evt) => {
  if (
    isEscapeKey(evt) &&
    !document.activeElement.parentElement.classList.contains(
      'img-upload__field-wrapper'
    )
  ) {
    evt.preventDefault();
    closeModal();
  }
};

const onOverlayClick = (evt) => {
  if (
    evt.target.classList.contains('overlay') ||
    evt.target.classList.contains('img-upload__overlay') ||
    evt.target.classList.contains('error') ||
    evt.target.classList.contains('success')
  ) {
    evt.preventDefault();
    closeModal();
  }
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {
  getRandomInt,
  createRandomIdGenerator,
  onDocumentKeydown,
  onOverlayClick,
  shuffle,
  debounce,
};
