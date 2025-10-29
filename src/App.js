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






// import React, { useEffect, useState } from 'react';
// import './App.css';

// function App() {
//   const [reply, setReply] = useState('');

//   useEffect(() => {
//     // Listen for reply from main process
//     window.electronAPI.onReply((data) => {
//       setReply(data);
//     });
//   }, []);

//   const handleClick = () => {
//     // Send message to main process
//     window.electronAPI.sendMessage('Hello from React!');
//   };

//   return (
//     <div className="App">
//       <h1>React + Electron IPC Demo</h1>
//       <button onClick={handleClick}>Send Message to Main</button>
//       <p><strong>Reply from Main:</strong> {reply}</p>
//     </div>
//   );
// }

// export default App;





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Home from './views/Home';
// import Settings from './views/Settings';
// import About from './views/About';

// function App() {
//   const navStyle = {
//     display: 'flex',
//     gap: '1rem',
//     padding: '1rem',
//     borderBottom: '1px solid #ccc',
//     backgroundColor: '#f9f9f9',
//   };

//   return (
//     <Router>
//       <div>
//         <nav style={navStyle}>
//           <Link to="/">Home</Link>
//           <Link to="/settings">Settings</Link>
//           <Link to="/about">About</Link>
//         </nav>

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/about" element={<About />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;





import * as React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Home from './views/Home';
import Settings from './views/Settings';
import About from './views/About';

// A helper component to show content per tab
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ padding: '2rem' }}>
      {value === index && children}
    </div>
  );
}

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* make a custom component for this similar to TabPanel */}
      <p>Select setups to view/compare. Dropdown selector? Or something better? (show them side-by-side if there are 2 selected)</p>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', background: '#f5f5f5' }}
      >
        <Tab label="Home" />
        <Tab label="Settings" />
        <Tab label="About" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Home />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Settings />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <About />
      </TabPanel>
    </Box>
  );
}

