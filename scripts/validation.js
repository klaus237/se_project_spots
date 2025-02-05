const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputEl, errorMsg, config) => {
  const errorMsgEL = formElement.querySelector(`#${inputEl.id}-error`);
  errorMsgEL.textContent = errorMsg;
  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formElement, inputEl, config) => {
  const errorMsgID = `${inputEl.id}-error`;
  const errorMsgEL = formElement.querySelector(`#${errorMsgID}`);

  if (!errorMsgEL) return;

  errorMsgEL.textContent = "";
  inputEl.classList.remove(config.inputErrorClass);
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid || input.value.trim() === "";
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (!buttonElement) return;

  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

const checkInputValidity = (formElement, inputEl, config) => {
  if (inputEl.value.trim() === "") {
    showInputError(formElement, inputEl, "Please fill out this field", config);
  } else if (!inputEl.validity.valid) {
    showInputError(formElement, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formElement, inputEl, config);
  }
};
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// const resetValidation = (formEl, inputList, config) => {
//   inputList.forEach((input) => {
//     hideInputError(formEl, input, config);
//   });
//   const buttonElement = formEl.querySelector(config.submitButtonSelector);
//   if (buttonElement) {
//     disableButton(buttonElement, config);
//   }
// };

const resetValidation = (formEl, inputList, config) => {
  console.log(inputList);
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
    input.classList.remove(config.inputErrorClass);
  });

  const buttonElement = formEl.querySelector(config.submitButtonSelector);
  if (buttonElement) {
    toggleButtonState(inputList, buttonElement, config); // Dynamically set button state
  }
};

const disableButton = (buttonElement, config) => {
  if (!buttonElement) return;
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });

  console.log(formList);
};

enableValidation(settings);
