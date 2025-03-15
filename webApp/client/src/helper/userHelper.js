/**
 * @fileOverview This file provides a set of utility functions to manage user authentication and account operations
 * within a React application. Using Axios for HTTP communication and jwt-decode for token decoding, these functions 
 * handle tasks such as retrieving user details, authenticating users, registering new accounts, verifying passwords, 
 * updating profiles, generating and verifying OTPs, and resetting passwords. The utilities incorporate robust error 
 * handling and token-based authorization, ensuring secure and reliable interaction with the server.
 */

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/**
 * Retrieve the username from the token.
 *
 * This function decodes a JWT token stored in local storage to extract the username.
 *
 * @async
 * @function
 * @returns {Promise<Object>} A Promise resolving to the decoded token object.
 * @throws {string} Error message if the token is not found.
 */
export async function getUsername() {
  const token = localStorage.getItem('token');
  if (!token) return Promise.reject('Cannot find Token');
  const decode = jwtDecode(token);
  return decode;
}

/**
 * Authenticate a user.
 *
 * Sends the username to the server to verify if it exists.
 *
 * @async
 * @function
 * @param {string} username - The username to authenticate.
 * @returns {Promise<Object>} Promise resolving to the server's response, or an error message if the username is not found.
 */
export async function authenticate(username) {
  try {
    return await axios.post('/api/authenticate', { username });
  } catch (error) {
    return { error: "Le nom d'utilisateur n'existe pas...!" };
  }
}

/**
 * Get user details.
 *
 * Fetches user details from the server based on the provided username.
 *
 * @async
 * @function
 * @param {Object} param - An object containing the username.
 * @param {string} param.username - The username to fetch details for.
 * @returns {Promise<Object>} A Promise resolving to the user's details.
 * @throws {Object} Error object with a message if the request fails.
 */
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: 'Mot de passe erroné...!' };
  }
}

/**
 * Register a new user.
 *
 * Sends user credentials to the server to create a new account.
 *
 * @async
 * @function
 * @param {Object} credentials - The user's registration credentials.
 * @returns {Promise<void>} Resolves if registration is successful.
 * @throws {Object|Error} Error object if registration fails or username/email is already taken.
 */
export async function registerUser(credentials) {
  try {
    const {
      data: { msg, error },
      status,
    } = await axios.post(`/api/register`, credentials);
    if (status !== 201) {
      return Promise.reject({
        error: "Problème lors de la récupération de l'adresse mail",
      });
    }
    if (error) {
      return Promise.reject({ error, msg });
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**
 * Verify user password during login.
 *
 * Sends the username and password to the server to validate them.
 *
 * @async
 * @function
 * @param {Object} param - Object containing the username and password.
 * @param {string} param.username - The username of the user.
 * @param {string} param.password - The user's password.
 * @returns {Promise<Object>} Promise resolving to the server's response data.
 * @throws {Object} Error object with a message if the password is incorrect.
 */
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post('/api/login', { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: 'Mot de passe erroné...!' });
  }
}

/**
 * Update user profile.
 *
 * Sends updated user information to the server.
 *
 * @async
 * @function
 * @param {Object} response - The updated user data to send.
 * @returns {Promise<Object>} Promise resolving to the server's response data.
 * @throws {Object} Error object with a message if the update fails.
 */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem('token');
    const data = await axios.put('/api/updateuser', response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({
      error: 'Problème lors de la mise à jour du profil...!',
    });
  }
}

/**
 * Generate an OTP (One-Time Password).
 *
 * Requests an OTP to be generated for the specified username.
 *
 * @async
 * @function
 * @param {string} username - The username for which to generate an OTP.
 * @returns {Promise<number>} Resolves with the status code if successful.
 * @throws {Object} Error object if OTP generation fails.
 */
export async function generateOTP(username) {
  try {
    const { status } = await axios.post('/api/generateOTP', { username });
    if (status === 201) {
      return Promise.resolve(status);
    }
    return Promise.reject({
      error: 'Problème lors de la génération de l\'OTP!',
    });
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**
 * Verify an OTP.
 *
 * Sends the OTP and username to the server for verification.
 *
 * @async
 * @function
 * @param {Object} param - An object containing the username and OTP code.
 * @param {string} param.username - The username associated with the OTP.
 * @param {string} param.code - The OTP code to verify.
 * @returns {Promise<Object>} Promise resolving to the server's response data and status code.
 * @throws {Error} Error object if OTP verification fails.
 */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get('/api/verifyOTP', {
      params: { username, code },
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Reset a user's password.
 *
 * Sends the new password to the server for the specified username.
 *
 * @async
 * @function
 * @param {Object} param - An object containing the username and new password.
 * @param {string} param.username - The username of the user.
 * @param {string} param.password - The new password to set.
 * @returns {Promise<Object>} Promise resolving to the server's response data and status code.
 * @throws {Error} Error object if the password reset fails.
 */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put('/api/resetPassword', {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}