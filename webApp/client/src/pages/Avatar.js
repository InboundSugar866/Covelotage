/*
export default function Avatar({userId,username,online}) {

  const colors = {
    online: '#48bb78', // green-400
    offline: '#cbd5e0', // gray-400
    teal: '#80CBC4', // teal-200
    red: '#FED7D7', // red-200
    green: '#C6F6D5', // green-200
    purple: '#CE93D8', // purple-200
    blue: '#90CAF9', // blue-200
    yellow: '#FFF59D', // yellow-200
    orange: '#FEBD69', // orange-200
    pink: '#F48FB1', // pink-200
    fuchsia: '#D9027D', // fuchsia-200
    rose: '#FECDD3', // rose-200
  };
                  
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div className={"rounded-circle d-flex align-items-center "+color} style={{width: '2rem', height: '2rem'}}>
      <div className="text-center w-100" style={{opacity: '0.7'}}>{username[0]}</div>
      {online && (
        <div className="position-absolute" style={{width: "1rem", height: "1rem", backgroundColor: colors.online, bottom: "0", right: "0", borderRadius: "50%", border: "1px solid white"}}></div>
      )}
      {!online && (
        <div className="position-absolute" style={{width: '1rem', height: '1rem', backgroundColor: colors.offline, bottom: '0', right: '0', borderRadius: '50%', border: '1px solid white'}}></div>
      )}
    </div>
  );
}
*/


import '../styles/Avatar.css';

export default function Avatar({userId,username,online}) {
  const colors = ['teal', 'red', 'green', 'purple', 'blue', 'yellow', 'orange', 'pink', 'fuchsia', 'rose'];
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div className={"avatar "+color}>
      <div className="username">{username[0]}</div>
      {online && (
        <div className="status online"></div>
      )}
      {!online && (
        <div className="status offline"></div>
      )}
    </div>
  );
}
