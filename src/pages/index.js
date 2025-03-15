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
// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },

//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Val bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];
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
  // const profileName = document.querySelector(".profile__name");
  // const profileDescription = document.querySelector(".profile__description");

  profileName.textContent = user.name; // Update user name
  profileDescription.textContent = user.about; // Update description/bio
  profileAvatar.src = user.avatar; // Update profile picture
  profileAvatar.alt = user.name; // Set alt text for accessibility
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

  // cardLikedBtn.addEventListener("click", () => {
  //   cardLikedBtn.classList.toggle("card__like-btn_liked");
  // });

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
  deleteForm.addEventListener("submit", handleDeleteSubmit);

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });
  return cardElement;
}

// function disableButton(button, settings) {
//   button.setAttribute("disabled", true);
//   button.classList.add(settings.inactiveButtonClass);
// }

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      // Update UI with new user info
      console.log(data.avatar);

      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.log("Failed to update avatar:", err);
    })
    .finally(() => {
      // Reset the button text to "Save" once the request is complete
      setButtonText(submitBtn, false);
    });
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  //submitBtn.textContent = "Saving...";

  setButtonText(submitBtn, true);

  // Get user input
  const newName = nameInput.value;
  const newAbout = descriptionInput.value;

  // Update user info on the server
  api
    .editUserInfo({ name: newName, about: newAbout })
    .then((updatedUser) => {
      // Update UI with new user info
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.log("Failed to update user info:", err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  console.log(cardId);
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.log("Failed to delete card:", err);
    })
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  const inputValues = {
    link: cardLinkInput.value,
    name: cardNameInput.value,
  };
  api
    .createCard(inputValues) // Assuming you have a 'createCard' method in the Api class
    .then((newCard) => {
      // Add the new card to the page
      renderCard(newCard, "prepend");
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch((err) => {
      console.log("Failed to add new card:", err); // Handle errors (like invalid input or server issue)
    })
    .finally(() => {
      setButtonText(submitBtn, true);
    });
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
  console.log("Avatar edit button clicked!", avatarModal); // Check if this logs
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
