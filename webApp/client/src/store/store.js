// https://www.npmjs.com/package/zustand

import { create } from 'zustand';

/**
 * @constant {Function} useAuthStore
 * @description Zustand store for managing authentication state.
 *
 * @property {Object} auth - Object containing authentication details.
 * @property {string} auth.username - The username of the authenticated user.
 * @property {boolean} auth.active - The current status of the user's authentication session.
 * @property {Function} setUsername - Function to update the username in the authentication store.
 */
export const useAuthStore = create((set) => ({
    auth : {
        username : '',
        active : false
    },
    setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name }})) 
}))
