// // src/views/Settings.js
// import React, { useState } from 'react';

// function Settings() {
//   const [username, setUsername] = useState('User123');
//   const [theme, setTheme] = useState('light');

//   const handleSave = () => {
//     alert(`Settings saved: ${username} (${theme} mode)`);
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>⚙️ Settings</h2>

//       <div style={{ marginTop: '1rem' }}>
//         <label>
//           Username:
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             style={{ marginLeft: '0.5rem' }}
//           />
//         </label>
//       </div>

//       <div style={{ marginTop: '1rem' }}>
//         <label>
//           Theme:
//           <select
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//             style={{ marginLeft: '0.5rem' }}
//           >
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </label>
//       </div>

//       <button
//         onClick={handleSave}
//         style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
//       >
//         Save Settings
//       </button>
//     </div>
//   );
// }

// export default Settings;





// src/views/Settings.js
import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function WheelsAndBrakes() {
  const [username, setUsername] = useState('User123');
  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    alert(`Saved settings:\nUsername: ${username}\nTheme: ${theme}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
      <h2>⚙️ WheelsAndBrakes</h2>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        size="small"
      />
      <FormControl size="small">
        <InputLabel>Theme</InputLabel>
        <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
}
