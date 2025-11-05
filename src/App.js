import * as React from 'react';
import { Box, FormControl, InputLabel, Select, ListSubheader, MenuItem, Tabs, Tab } from '@mui/material';
import ChassisAndAero from './views/ChassisAndAero';
import Dampers from './views/Dampers';
import Powertrain from './views/Powertrain';
import WheelsAndBrakes from './views/WheelsAndBrakes';
import Suspension from './views/Suspension';
import SetupViewer from './components/SetupViewer';

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

  // // Simulate fetching data dynamically (e.g., from a file, API, or IPC call)
  // React.useEffect(() => {
  //   const setupList = ['setup1', 'setup2', 'setup3', 'setup4', 'setup5'];
  //   setSetups(setupList);
  // }, []);

  React.useEffect(() => {
    async function loadFiles() {
      try {
        const rootPath = 'F:/SteamLibrary/steamapps/common/Le Mans Ultimate/UserData/player/Settings';
        const filesByFolders = await window.electronAPI.getFolderFileMap(rootPath);
        console.log(filesByFolders);
        setSetups(filesByFolders);
      } catch (error) {
        console.error('Failed to load files:', error);
      }
    }
    loadFiles();
  }, []);  

  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl sx={{ width: '400px' }} size="small">
        <InputLabel>Selected setup</InputLabel>
        {/* any way to add a scrollbar? */}
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
            <ListSubheader key={track}>
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
      {/* make a custom component for this similar to TabPanel */}
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
        <Tab label="Powertrain" />
        <Tab label="Wheels & Brakes" />
        <Tab label="Suspension" />
        <Tab label="Dampers" />
        <Tab label="Chassis & Aero" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <SetupViewer selectedSetup={selectedSetup} />
        <Powertrain />
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
