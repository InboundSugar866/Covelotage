import toast from "react-hot-toast";
import { authenticate } from "./userHelper";

/**
 * Validate the login page username.
 *
 * This function checks if the username exists and verifies its format.
 *
 * @async
 * @function
 * @param {Object} values - The form values containing the username.
 * @returns {Promise<Object>} A Promise resolving to an errors object with validation messages.
 */
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  if (values.username) {
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error(
        "L'utilisateur n'a pas été trouvé, vérifiez le nom d'utilisateur"
      );
    }
  }
  return errors;
}

/**
 * Validate the password page.
 *
 * This function checks the validity of the password.
 *
 * @async
 * @function
 * @param {Object} values - The form values containing the password.
 * @returns {Promise<Object>} A Promise resolving to an errors object with validation messages.
 */
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

/**
 * Validate the reset form.
 *
 * This function validates the reset password form, including password confirmation.
 *
 * @async
 * @function
 * @param {Object} values - The form values for resetting the password.
 * @returns {Promise<Object>} A Promise resolving to an errors object with validation messages.
 */
export async function resetPasswordValidate(values) {
  const errors = resetPasswordVerify({}, values);
  return errors;
}

/**
 * Validate the register page.
 *
 * This function validates username, password, and email for the registration process.
 *
 * @async
 * @function
 * @param {Object} values - The form values for registration.
 * @returns {Promise<Object>} A Promise resolving to an errors object with validation messages.
 */
export async function registerValidate(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

/**
 * Validate the profile page.
 *
 * This function validates the email for the profile page.
 *
 * @async
 * @function
 * @param {Object} values - The form values for profile updates.
 * @returns {Promise<Object>} A Promise resolving to an errors object with validation messages.
 */
export async function profileValidate(values) {
  const errors = emailVerify({}, values);
  return errors;
}

/**
 * Validate the reset password.
 *
 * This helper function checks if the password matches the confirmation password.
 *
 * @function
 * @param {Object} errors - The errors object to update.
 * @param {Object} values - The form values containing the password and confirmation password.
 * @returns {Object} The updated errors object with validation messages.
 */
function resetPasswordVerify(errors = {}, values) {
  if (values.password !== values.confirm_pwd) {
    errors.password = toast.error("Mauvais mot de passe...!");
  }
  return errors;
}

/**
 * Verify the password.
 *
 * This helper function validates the password format and strength.
 *
 * @function
 * @param {Object} errors - The errors object to update.
 * @param {Object} values - The form values containing the password.
 * @returns {Object} The updated errors object with validation messages.
 */
function passwordVerify(errors = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    errors.password = toast.error("Mot de passe requis...!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Mauvais mot de passe...!");
  } else if (values.password.length < 8) {
    errors.password = toast.error(
      "Le mot de passe doit faire au moins 8 caractères"
    );
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error(
      "Le mot de passe doit contenir un caractère spécial"
    );
  }
  return errors;
}

/**
 * Verify the username.
 *
 * This helper function validates the username format.
 *
 * @function
 * @param {Object} errors - The errors object to update.
 * @param {Object} values - The form values containing the username.
 * @returns {Object} The updated errors object with validation messages.
 */
function usernameVerify(errors = {}, values) {
  if (!values.username) {
    errors.username = toast.error("Nom d'utilisateur requis...!");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Nom d'utilisateur inconnu...!");
  }
  return errors;
}

/**
 * Verify the email.
 *
 * This helper function validates the email format.
 *
 * @function
 * @param {Object} errors - The errors object to update.
 * @param {Object} values - The form values containing the email.
 * @returns {Object} The updated errors object with validation messages.
 */
function emailVerify(errors = {}, values) {
  if (!values.email) {
    errors.email = toast.error("Email requis...!");
  } else if (values.email.includes(" ")) {
    errors.email = toast.error("Email non reconnu...!");
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = toast.error("Email invalide...!");
  }
  return errors;
}
