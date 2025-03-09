import Avatar from "./Avatar.js";

/**
 * Contact component.
 *
 * This component renders a clickable contact card that displays the user's avatar, username,
 * and an indicator for whether the user is online. If the contact is selected, it highlights the card.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the contact.
 * @param {string} props.username - The username of the contact.
 * @param {Function} props.onClick - Callback function triggered when the contact is clicked.
 * @param {boolean} props.selected - Indicates if the contact is currently selected.
 * @param {boolean} props.online - Indicates if the contact is currently online.
 * @returns {JSX.Element} A JSX element representing the contact card.
 */
export default function Contact({ id, username, onClick, selected, online }) {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      class={"border-bottom border-dark d-flex align-items-center "}
      style={{ cursor: 'pointer' }}
    >
      {selected && (
        <div
          style={{
            width: '0.25rem',
            backgroundColor: '#4F772D',
            height: '3rem',
            borderRadius: '0 0.5rem 0.5rem 0',
          }}
        ></div>
      )}
      <div
        class="d-flex align-items-center"
        style={{ padding: '0.5rem 0 0.5rem 1rem' }}
      >
        <Avatar online={online} username={username} userId={id} />
        <span class="text-dark">{username}</span>
      </div>
    </div>
  );
}
