import { TEXT_NUMS } from '../constants.js';
import { sendData } from '../store/fetch-api.js';
import { showSuccesMessage, showErrorMessage } from './render-load-result.js';
import '../../vendor/pristine/pristine.min.js';

const body = document.body;
const uploadForm = body.querySelector('.img-upload__form');
const overlay = uploadForm.querySelector('.img-upload__overlay');
const imgText = overlay.querySelector('.img-upload__text');
const sendButton = overlay.querySelector('#upload-submit');
const textHashTags = imgText.querySelector('.text__hashtags');
const textDescription = imgText.querySelector('.text__description');

const pristine = new Pristine(
  imgText,
  {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__field-wrapper--error',
  },
  false
);

const validateHashTag = (value) => {
  const hashTagRegexp = /^#[a-zа-яё0-9]{1,20}$/i;
  let notMatches = [];
  if (value !== '') {
    const hashTags = value.split(' ');
    notMatches = hashTags.filter((element) => !hashTagRegexp.test(element));
  }
  return notMatches.length === 0;
};

const checkUniqueHashTag = (hashTagValue) => {
  const hashTags = hashTagValue.split(' ');
  const uniqueHashTags = hashTags.filter(
    (value, index, array) =>
      array.findIndex((el) => el.toLowerCase() === value.toLowerCase()) ===
      index
  );

  return hashTags.length === uniqueHashTags.length;
};

const checkQtyHashTags = (value) => {
  const hashTags = value.split(' ');
  return hashTags.length <= TEXT_NUMS.hashtagMax;
};

const checkDescriptionLength = (value) => value.length <= TEXT_NUMS.textMax;

pristine.addValidator(
  textHashTags,
  validateHashTag,
  'введён невалидный хэштег'
);
pristine.addValidator(
  textHashTags,
  checkUniqueHashTag,
  'Хэштеги должны быть уникальными'
);
pristine.addValidator(textHashTags, checkQtyHashTags, 'хэштеги повторяются');
pristine.addValidator(
  textDescription,
  checkDescriptionLength,
  'длина комментария больше 140 символов'
);

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    sendButton.disabled = true;
    sendData(new FormData(evt.target))
      .then(showSuccesMessage)
      .catch(showErrorMessage)
      .finally(() => {
        sendButton.disabled = false;
      });
  }
});
