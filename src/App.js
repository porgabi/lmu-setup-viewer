import * as React from 'react';
import { Box, FormControl, InputLabel, Select, ListSubheader, MenuItem, Tabs, Tab } from '@mui/material';
import ChassisAndAero from './views/ChassisAndAero';
import Dampers from './views/Dampers';
import Powertrain from './views/Powertrain';
import WheelsAndBrakes from './views/WheelsAndBrakes';
import Suspension from './views/Suspension';

// A component to show content per tab.
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ padding: '2rem' }}>
      {value === index && children}
    </div>
  );
}

// A component to select a setup from a list of setups.
function SetupSelector({ selectedSetup, onSelect }) {
  const [setups, setSetups] = React.useState([]);
  const [lmuPath, setLmuPath] = React.useState('');

  // React.useEffect(() => {
  //   async function loadFiles() {
  //     try {
  //       const rootPath = 'F:/SteamLibrary/steamapps/common/Le Mans Ultimate/UserData/player/Settings';
  //       const filesByFolders = await window.electronAPI.getFolderFileMap(rootPath);
  //       console.log(filesByFolders);
  //       setSetups(filesByFolders);
  //     } catch (error) {
  //       console.error('Failed to load files:', error);
  //     }
  //   }
  //   loadFiles();
  // }, []);  

  // const handleChange = (event) => {
  //   onSelect(event.target.value);
  // };

  React.useEffect(() => {
    async function initLmuPath() {
      if (!window?.electronAPI?.getLmuPath) {
        console.warn('electronAPI unavailable');
        return;
      }

      let savedPath = await window.electronAPI.getLmuPath();
      if (savedPath) {
        setLmuPath(savedPath);
        const filesByFolders = await window.electronAPI.getFolderFileMap(savedPath + '/UserData/player/Settings');
        setSetups(filesByFolders);
      }
    }

    initLmuPath();
  }, []);

  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  const handleChangeLmuPath = async () => {
      if (!window?.electronAPI?.getLmuPath) {
        console.warn('electronAPI unavailable');
        return;
      }
    
    const newPath = await window.electronAPI.setLmuPath();
    if (newPath) {
      setLmuPath(newPath);
      const filesByFolders = await window.electronAPI.getFolderFileMap(newPath + '/UserData/player/Settings');
      setSetups(filesByFolders);
    }
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <p>Current root path: {lmuPath || '(not set)'}</p>
      <button onClick={handleChangeLmuPath}>Change LMU Folder</button>
      <FormControl sx={{ width: '400px' }} size="small">
        <InputLabel>Selected setup</InputLabel>
        <Select
          value={selectedSetup}
          label="Selected setup"
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                overflowY: 'auto'
              }
            }
          }}
        >
          {/* {setups.map((item) => (
            // display without file extension
            // display track name before setup name, i.e. Bahrain/HYMO Q dev -- including layouts (which are in separate folders)
            <MenuItem key={item} value={item.toLowerCase()}>
              {item}
            </MenuItem>
          ))} */}
          {Object.entries(setups).map(([track, files]) => [
            // make subheader text bold -- or give it a different colored background?
            <ListSubheader key={track} sx={{ backgroundColor: 'grey', textTransform: 'uppercase' }}>
              <b>{track}</b>
            </ListSubheader>,
            files.map((file) => {
              const setupName = file.replace(/\.[^/.]+$/, "");
              const value = `${track}/${setupName}`;
              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              );
            }),
          ])}        
        </Select>
      </FormControl>
    </Box>
  );
}

export default function App() {
  const [value, setValue] = React.useState(0);
  const [selectedSetup, setSelectedSetup] = React.useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <p>Select setups to view/compare. Dropdown selector? Or something better? (show them side-by-side if there are 2 selected)</p>
      <SetupSelector selectedSetup={selectedSetup} onSelect={setSelectedSetup} />
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', background: '#f5f5f5' }}
      >
        <Tab label="Powertrain" sx={{ fontWeight: 'bold' }} />
        <Tab label="Wheels & Brakes" sx={{ fontWeight: 'bold' }} />
        <Tab label="Suspension" sx={{ fontWeight: 'bold' }} />
        <Tab label="Dampers" sx={{ fontWeight: 'bold' }} />
        <Tab label="Chassis & Aero" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Powertrain selectedSetup={selectedSetup} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WheelsAndBrakes />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Suspension />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Dampers />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ChassisAndAero />
      </TabPanel>
    </Box>
  );
}
