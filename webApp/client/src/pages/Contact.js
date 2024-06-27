import Avatar from "./Avatar.js";

export default function Contact({id,username,onClick,selected,online}) {
  return (
    <div key={id} onClick={() => onClick(id)}
         className={"border-bottom border-light d-flex align-items-center "+(selected ? 'bg-light' : '')} style={{cursor: 'pointer'}}>
      {selected && (
        <div style={{width: '0.25rem', backgroundColor: '#007bff', height: '3rem', borderRadius: '0 0.5rem 0.5rem 0'}}></div>
      )}
      <div className="d-flex align-items-center" style={{padding: '0.5rem 0 0.5rem 1rem'}}>
        <Avatar online={online} username={username} userId={id} />
        <span className="text-dark">{username}</span>
      </div>
    </div>
  );
}
