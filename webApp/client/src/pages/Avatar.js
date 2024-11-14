import '../styles/Avatar.css';

export default function Avatar({userId,username,online}) {
  console.log(userId);

  // Check if userId and username are defined and have the expected value 
  if (!userId || userId.length < 10) { 
    console.error("Invalid userId:", userId); 
    return null; 
  } 
  
  if (!username || username.length === 0) { 
    console.error("Invalid username:", username); 
    return null; 
  }

  const colors = ['teal', 'red', 'green', 'purple', 'blue', 'yellow', 'orange', 'pink', 'fuchsia', 'rose', 'online', 'offline'];
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div class={"rounded-circle d-flex align-items-center "+color} style={{width: '2rem', height: '2rem', position: 'relative'}}>
      <div class="text-center w-100" style={{opacity: '0.7'}}>{username[0]}</div>
      {online && (
        <div class={"position-absolute "+colors[colors.length - 2]} style={{width: "0.7rem", height: "0.7rem", bottom: "0", right: "0", borderRadius: "50%", border: "1px solid white"}}></div>
      )}
      {!online && (
        <div class={"position-absolute "+colors[colors.length - 1]}style={{width: '0.7rem', height: '0.7rem', bottom: '0', right: '0', borderRadius: '50%', border: '1px solid white'}}></div>
      )}
    </div>
  );
}