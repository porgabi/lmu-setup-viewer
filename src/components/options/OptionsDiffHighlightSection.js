import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

export default function OptionsDiffHighlightSection({ checked, onChange }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label="Highlight differences"
    />
  );
}
