// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [reply, setReply] = useState('');

  useEffect(() => {
    // Listen for reply from main process
    window.electronAPI.onReply((data) => {
      setReply(data);
    });
  }, []);

  const handleClick = () => {
    // Send message to main process
    window.electronAPI.sendMessage('Hello from React!');
  };

  return (
    <div className="App">
      <h1>React + Electron IPC Demo</h1>
      <button onClick={handleClick}>Send Message to Main</button>
      <p><strong>Reply from Main:</strong> {reply}</p>
    </div>
  );
}

export default App;
