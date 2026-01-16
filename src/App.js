import * as React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import SetupSelector from './components/SetupSelector';
import ChassisAndAero from './views/ChassisAndAero';
import Dampers from './views/Dampers';
import Powertrain from './views/Powertrain';
import WheelsAndBrakes from './views/WheelsAndBrakes';
import Suspension from './views/Suspension';

// A component to show content per tab.
function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ px: 3, py: 2.5 }}>
      {value === index && children}
    </Box>
  );
}

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <SetupSelector />
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        variant="scrollable"
        scrollButtons={false}
        allowScrollButtonsMobile
        sx={{ px: 2 }}
      >
        <Tab label="Powertrain" />
        <Tab label="Wheels & Brakes" />
        <Tab label="Suspension" />
        <Tab label="Dampers" />
        <Tab label="Chassis & Aero" />
      </Tabs>

      <TabPanel value={value} index={0}>
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
