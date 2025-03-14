export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving"
) {
  if (isLoading) {
    btn.textContent = loadingText; // Change text to "Saving"
  } else {
    btn.textContent = defaultText; // Reset text to "Save"
  }
}
