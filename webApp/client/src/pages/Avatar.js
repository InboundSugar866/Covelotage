/**
 * @fileOverview This file contains the implementation of the Avatar component in a React application. The Avatar component 
 * dynamically generates a circular avatar with a unique background color based on the user's `userId`. It also displays 
 * the first letter of the username and includes a status indicator (online/offline). The component validates input properties 
 * to ensure correctness and logs errors if validation fails. Additionally, the avatar's style and color enhance user 
 * identification and provide an intuitive visual representation.
 */

import '../styles/Avatar.css';

/**
 * Avatar component.
 *
 * This component renders a circular avatar with a dynamically assigned background color based on the `userId`.
 * It also displays the first letter of the username in the center and a status indicator (online/offline).
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.userId - The unique identifier of the user. Must be at least 10 characters long.
 * @param {string} props.username - The username of the user. Must be a non-empty string.
 * @param {boolean} props.online - The user's online status. Displays a green dot if online, or a red dot if offline.
 * @returns {JSX.Element|null} A JSX element representing the avatar or `null` if the input validation fails.
 */
export default function Avatar({ userId, username, online }) {
  // Check if userId and username are defined and have the expected value
  if (!userId || userId.length < 10) {
    console.error("Invalid userId:", userId);
    return null;
  }

  if (!username || username.length === 0) {
    console.error("Invalid username:", username);
    return null;
  }

  const colors = [
    'teal', 'red', 'green', 'purple', 'blue', 'yellow', 'orange', 'pink',
    'fuchsia', 'rose', 'online', 'offline'
  ];
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      class={"rounded-circle d-flex align-items-center " + color}
      style={{ width: '2rem', height: '2rem', position: 'relative' }}
    >
      <div class="text-center w-100" style={{ opacity: '0.7' }}>
        {username[0]}
      </div>
      {online && (
        <div
          class={"position-absolute " + colors[colors.length - 2]}
          style={{
            width: "0.7rem",
            height: "0.7rem",
            bottom: "0",
            right: "0",
            borderRadius: "50%",
            border: "1px solid white"
          }}
        ></div>
      )}
      {!online && (
        <div
          class={"position-absolute " + colors[colors.length - 1]}
          style={{
            width: '0.7rem',
            height: '0.7rem',
            bottom: '0',
            right: '0',
            borderRadius: '50%',
            border: '1px solid white'
          }}
        ></div>
      )}
    </div>
  );
}
