"use strict";
// DOM Elements
const $modalBg = /** @type {HTMLDivElement} */ (document.querySelector(".bground"));
const $modalBtn = /** @type {NodeListOf<HTMLButtonElement>} */ (
	document.querySelectorAll(".modal-btn")
);
const $formData = /** @type {NodeListOf<HTMLDivElement>} */ (
	document.querySelectorAll(".formData")
);
const $closeBtns = /** @type {NodeListOf<HTMLElement>} */ (
	document.querySelectorAll("[data-action='close']")
);
const $form = /** @type {HTMLFormElement} */ (document.querySelector('[name="reserve"]'));
const $firstname = /** @type {HTMLInputElement} */ (document.getElementById("first"));
const $lastname = /** @type {HTMLInputElement} */ (document.getElementById("last"));
const $email = /** @type {HTMLInputElement} */ (document.getElementById("email"));
const $birthdate = /** @type {HTMLInputElement} */ (document.getElementById("birthdate"));
const $quantity = /** @type {HTMLInputElement} */ (document.getElementById("quantity"));
const $locations = /** @type {NodeListOf<HTMLInputElement>} */ (
	document.querySelectorAll(".checkbox-input[type='radio']")
);
const $conditions = /** @type {HTMLInputElement} */ (document.getElementById("checkbox1"));

function editNav() {
	var $x = document.getElementById("myTopnav");
	if ($x) {
		if ($x.className === "topnav") {
			$x.className += " responsive";
		} else {
			$x.className = "topnav";
		}
	} else {
		throw new Error("Nav not found");
	}
}

// launch modal event
$modalBtn.forEach(($btn) => $btn.addEventListener("click", launchModal));

// remove the data-error and data-error-visible attributes
$formData.forEach(($inputBlock) => {
	// get the input elements from its parent
	const inputs = $inputBlock.querySelectorAll("input");
	inputs.forEach((input) => {
		// remove the data-error and data-error-visible attributes from
		// the parent element when the input is clicked
		input.addEventListener("click", () => {
			$inputBlock.removeAttribute("data-error");
			$inputBlock.removeAttribute("data-error-visible");
		});
	});
});

$closeBtns.forEach(
	/** @param {HTMLElement} $btn */
	($btn) => {
		$btn.addEventListener("click", () => closeModal($btn));
	}
);

// listen for submit event
if ($form) {
	$form.addEventListener("submit", validateform);
} else {
	throw new Error("Form not found");
}

/**
 * @description
 * This function is used to launch the modal $form
 */
function launchModal() {
	if ($modalBg) {
		$modalBg.style.display = "block";
		if (document.body.clientWidth < 800) {
			const $nav = document.getElementById("myTopnav");
			$modalBg.style.marginTop = $nav?.clientHeight + "px";
		} else {
			$modalBg.style.marginTop = "0px";
		}
		toggleBodyOverflow();
		$formData.forEach(($input) => {
			$input.removeAttribute("data-error");
			$input.removeAttribute("data-error-visible");
		});
	} else {
		throw new Error("Modal background not found");
	}
}

/**
 * @description
 * This function is used to validate an $email
 * @param {string} email
 * @returns boolean
 */
function validateEmail(email) {
	const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,63})$/;
	return re.test(email);
}

/**
 * @description
 * This function is used to close the modal $form
 * @param {HTMLElement} $element
 */
function closeModal($element) {
	/** @type {HTMLElement | null} */
	const $parentModal = $element.closest("[data-container='modal']");
	if ($parentModal) {
		$parentModal.style.display = "none";
		toggleBodyOverflow();
	} else {
		throw new Error("Modal not found");
	}
}

/**
 * @description
 * This function is used to show an error message
 * @param {HTMLInputElement} $input
 * @param {string} message
 */
function showError($input, message) {
	const $formControl = $input?.parentElement;
	// add the data-error attribute to the parent element
	$formControl?.setAttribute("data-error", message);
	$formControl?.setAttribute("data-error-visible", "true");
}

/**
 * @description
 * This function is used to validate the $form
 * @param {SubmitEvent} e
 */
function validateform(e) {
	e.preventDefault();
	let isValid = true;

	// check if $firstname is empty
	if (!$firstname || $firstname.value.trim().length < 2) {
		showError($firstname, "Le prénom est requis");
		isValid = false;
	}

	// check if $lastname is empty
	if (!$lastname || $lastname.value.trim().length < 2) {
		showError($lastname, "Le nom de famille est requis");
		isValid = false;
	}

	// check if $email is empty or invalid
	if (!$email || $email.value.trim().length < 2 || !validateEmail($email?.value || "")) {
		showError($email, "Un email valide est requis");
		isValid = false;
	}

	// check if $birthdate is empty
	if (!$birthdate || $birthdate.value.trim() === "" || !birthdateValidation($birthdate.value)) {
		showError($birthdate, "Une date de naissance valide est requise");
		isValid = false;
	}

	// check if $quantity is empty
	if (!$quantity || $quantity.value.trim() === "" || isNaN(+$quantity?.value)) {
		showError($quantity, "Une quantité valide est requise");
		isValid = false;
	}

	// check if at least one location is checked
	let locationChecked = Array.from($locations).some((location) => location.checked);
	if (!locationChecked) {
		showError($locations[0], "Une ville est requise");
		isValid = false;
	}

	// check if $conditions is checked
	if (!$conditions.checked) {
		showError($conditions, "Vous devez accepter les conditions d'utilisation");
		isValid = false;
	}

	if (isValid) {
		closeModal(/** @type {HTMLElement} */ (e.target));
		$form?.reset();
		openThankYouModal();
	}
}

function openThankYouModal() {
	toggleBodyOverflow();
	const $thankYouModal = /** @type {HTMLElement} */ (document.querySelector("#thanks-modal"));
	if ($thankYouModal) {
		$thankYouModal.style.display = "block";
	} else {
		throw new Error("Thank you modal not found");
	}
}

/**
 * @param {string} birth
 * @returns boolean
 */
function birthdateValidation(birth) {
	const today = new Date();
	const birthdate = new Date(birth);
	return birthdate < today;
}

function toggleBodyOverflow() {
	document.body.style.overflow = document.body.style.overflow === "hidden" ? "auto" : "hidden";
}
