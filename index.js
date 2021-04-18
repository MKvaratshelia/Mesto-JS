const root = document.querySelector(".root");
const cardsList = document.querySelector(".places-list");
const popup = document.querySelector(".popup");
const placeName = document.querySelector(".popup__input_type_name");
const placeLink = document.querySelector(".popup__input_type_link-url");
const imagePopup = document.querySelector(".popup__image");
const popupImageItem = document.querySelector(".popup__image-item");
const profilePopup = document.querySelector(".popup__profile");
const userName = document.querySelector(".user-info__name");
const aboutUser = document.querySelector(".user-info__job");
const profileForm = document.querySelector(".popup__form-profile");
const userNameInput = profileForm.elements.name;
const aboutUserInput = profileForm.elements.about;
const buttonSave = document.querySelector(".popup__button_save");
const placeForm = document.querySelector(".popup__form-place");
const buttonAdd = document.querySelector(".popup__button_add");

const errorMessage = {
  length: "Должно быть от 2 до 30 символов",
  required: "Это обязательное поле",
};

const card = ({ name, link }) => {
  const placeCard = document.createElement("div");
  placeCard.classList.add("place-card");
  placeCard.insertAdjacentHTML(
    "afterBegin",
    `
    <div class="place-card__image" data-link=${link} data-place=${name} style="background-image: url(${link})">
        <button class="place-card__delete-icon"></button>
    </div>
    <div class="place-card__description">
      <h3 class="place-card__name">${name}</h3>
      <button class="place-card__like-icon"></button>
    </div>
 `
  );
  return placeCard;
};

const getCards = (cards, cardsList, card) => {
  cards.forEach((c) => {
    cardsList.appendChild(card(c));
  });
};

const openPopup = (popup) => {
  popup.classList.add("popup_is-opened");
};

const closePopup = (popup) => {
  popup.classList.remove("popup_is-opened");
};

const toggleLike = (e) => {
  const likeIcon = e.target;
  likeIcon.classList.toggle("place-card__like-icon_liked");
};

const addCard = (name, place, card, cardsList) => {
  const cardObj = { name: name.value, link: place.value };

  cardsList.appendChild(card(cardObj));
};

const deleteCard = (cardsList, e) => {
  const element = e.target;
  const card = element.parentNode.parentNode;
  cardsList.removeChild(card);
};

const addImage = (e, image) => {
  const el = e.target;
  const url = el.dataset.link;
  const place = el.dataset.place;
  image.setAttribute("src", url);
  image.setAttribute("alt", place);
};

const editProfile = (nameInput, aboutInput, name, about) => {
  name.textContent = nameInput.value;
  about.textContent = aboutInput.value;
};

root.addEventListener("click", (e) => {
  const el = e.target;
  if (el.classList.contains("place-card__like-icon")) {
    toggleLike(e);
  }
  if (el.classList.contains("place-card__delete-icon")) {
    deleteCard(cardsList, e);
  }

  if (el.classList.contains("user-info__button")) {
    openPopup(popup);
  } else if (el.classList.contains("popup__close")) {
    closePopup(popup);
  }

  if (el.classList.contains("place-card__image")) {
    addImage(e, popupImageItem);
    openPopup(imagePopup);
  } else if (el.classList.contains("popup__close")) {
    closePopup(imagePopup);
  }

  if (el.classList.contains("user-info__button-edit")) {
    userNameInput.value = userName.textContent;
    aboutUserInput.value = aboutUser.textContent;
    openPopup(profilePopup);
  } else if (el.classList.contains("popup__close")) {
    closePopup(profilePopup);
  }
});

// const buttonValidate = (button, name, about) => {
//   (name.value.length && about.value.length) === 0
//     ? button.setAttribute("disabled", "true")
//     : button.removeAttribute("disabled");
// };
const buttonValidate = (button, state) => {
  state
    ? button.setAttribute("disabled", "true")
    : button.removeAttribute("disabled");
};

const validate = (element, error) => {
  let errorMessage = document.querySelector(`#error-${element.id}`);
  errorMessage.textContent = "";
  if (!element.checkValidity()) {
    if (element.value.length === 0) {
      errorMessage.textContent = error.required;
    } else if (element.value.length === 1) {
      errorMessage.textContent = error.length;
    }
    return false;
  } else {
    return true;
  }
};

const sendForm = (form, error, button) => {
  let isValidForm = true;
  const inputs = [...form.elements];

  inputs.forEach((el) => {
    if (el.id !== "submit") {
      if (!validate(el, error)) {
        isValidForm = false;
        buttonValidate(button, isValidForm);
      } else {
        isValidForm = true;
        buttonValidate(button, isValidForm);
      }
    }
  });
};

document.querySelector(".popup__form").addEventListener("submit", (e) => {
  e.preventDefault();
  addCard(placeName, placeLink, card, cardsList, initialCards);
  closePopup(popup);
});

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  editProfile(userNameInput, aboutUserInput, userName, aboutUser);
  // closePopup(profilePopup);
});

profileForm.addEventListener("input", (e) => {
  sendForm(profileForm, errorMessage, buttonSave);
  buttonValidate(buttonSave, false);
});

placeForm.addEventListener("input", (e) => {
  buttonValidate(buttonAdd, true);
});

getCards(initialCards, cardsList, card);
