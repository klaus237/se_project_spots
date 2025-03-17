import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencilIcon from "../images/pencil.svg";
import plusIcon from "../images/plus.svg";
import closeIcon from "../images/close.svg";
import { setButtonText } from "../utils/Helpers.js";
import { handleSubmit, renderLoading } from "../utils/utils.js";
// const initialCards = [

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a5f87dfd-b17a-4407-b00f-217fbb7b6897",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      renderCard(item);
    });
    // Handle and update user information
    updateUserInfo(user);
  })
  .catch((err) => {
    console.log(err);
  });

//profile elements
const editModal = document.querySelector("#edit-modal");
const editForm = document.forms["edit-profile"];
const cardModalButton = document.querySelector(".profile__add-btn");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
const cardForm = document.forms["add-card-form"];
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");
const cardModalBtn = document.querySelector(".profile__new-post-btn");
const editModalButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const previewModal = document.querySelector("#preview-modal");
const closeModalButton = previewModal.querySelector(".modal__close-btn");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close-btn");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");

const avatarSubmitBtn = avatarModal.querySelector(".modal__button");

const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileAvatar = document.querySelector(".profile__avatar");
const avatarModalButton = document.querySelector(".profile__avatar-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

let selectedCard, selectedCardId;

const cancelButton = document.querySelector(".modal__submit-btn--cancel");

cancelButton.addEventListener("click", () => {
  closeModal(deleteModal); // Close the delete modal
});

// Exemple pour injecter les images dans la page
document.querySelector(".header__logo").src = logo;
// document.querySelector(".profile__avatar").src = avatar;

const editBtn = document.querySelector(".profile__edit-btn img");
if (editBtn) editBtn.src = pencilIcon;

const addBtn = document.querySelector(".profile__add-btn img");
if (addBtn) addBtn.src = plusIcon;

const closeBtns = document.querySelectorAll(".modal__close-btn img");
closeBtns.forEach((btn) => (btn.src = closeIcon));

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function updateUserInfo(user) {
  profileName.textContent = user.name;
  profileDescription.textContent = user.about;
  profileAvatar.src = user.avatar;
  profileAvatar.alt = user.name;
}

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal(modal);
  });
});

function handleLikeToggle(event, cardId) {
  const likeButton = event.target;
  const isLiked = likeButton.classList.contains("card__like-btn_liked");
  api
    .changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-btn_liked");
      } else {
        likeButton.classList.remove("card__like-btn_liked");
      }
    })
    .catch((err) => console.error(`Erreur : ${err}`));
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardNameEl.textContent = data.name;

  if (data.isLiked) {
    cardLikedBtn.classList.add("card__like-btn_liked");
  } else {
    cardLikedBtn.classList.remove("card__like-btn_liked");
  }

  cardLikedBtn.addEventListener("click", (evt) =>
    handleLikeToggle(evt, data._id)
  );
  deleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });
  return cardElement;
}
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleAvatarFormSubmit(evt) {
  function makeRequest() {
    return api
      .editAvatarInfo(avatarInput.value)
      .then((data) => {
        profileAvatar.src = data.avatar;
        closeModal(avatarModal);
      })
      .catch((err) => {
        console.log("Failed to update avatar:", err);
      });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

function handleEditProfileSubmit(evt) {
  function makeRequest() {
    const newName = nameInput.value;
    const newAbout = descriptionInput.value;

    return api
      .editUserInfo({ name: newName, about: newAbout })
      .then((updatedUser) => {
        profileName.textContent = updatedUser.name;
        profileDescription.textContent = updatedUser.about;
        closeModal(editModal);
      })
      .catch((err) => {
        console.log("Failed to update user info:", err);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  console.log(cardId);
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api
      .deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModal(deleteModal);
      })
      .catch((err) => {
        console.log("Failed to delete card:", err);
      });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleAddCardSubmit(evt) {
  function makeRequest() {
    const inputValues = {
      link: cardLinkInput.value,
      name: cardNameInput.value,
    };
    return api
      .createCard(inputValues)
      .then((newCard) => {
        renderCard(newCard, "prepend");
        cardForm.reset();
        disableButton(cardSubmitBtn, settings);
        closeModal(cardModal);
      })
      .catch((err) => {
        console.log("Failed to add new card:", err);
      });
  }
  handleSubmit(makeRequest, evt);
}

editModalButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;

  const inputList = [nameInput, descriptionInput];
  resetValidation(editForm, inputList, settings);

  openModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  console.log("Avatar edit button clicked!", avatarModal);
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarFormSubmit);
editForm.addEventListener("submit", handleEditProfileSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});
enableValidation(settings);
