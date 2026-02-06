import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

export default function OptionsUpdatesOnLaunchSection({ checked, onChange }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label="Check for updates on launch"
    />
  );
}
