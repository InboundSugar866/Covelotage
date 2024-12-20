import Avatar from "./Avatar.js";

export default function Contact({id,username,onClick,selected,online}) {
  return (
    <div key={id} onClick={() => onClick(id)}
         class={"border-bottom border-dark d-flex align-items-center "} style={{cursor: 'pointer'}}>
      {selected && (
        <div style={{width: '0.25rem', backgroundColor: '#4F772D', height: '3rem', borderRadius: '0 0.5rem 0.5rem 0'}}></div>
      )}
      <div class="d-flex align-items-center" style={{padding: '0.5rem 0 0.5rem 1rem'}}>
        <Avatar online={online} username={username} userId={id} />
        <span class="text-dark">{username}</span>
      </div>
    </div>
  );
}
