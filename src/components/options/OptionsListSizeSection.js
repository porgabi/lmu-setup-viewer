import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { hintTextSx } from './hintTextStyles';

export default function OptionsListSizeSection({ value, onChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Setup list size
      </Typography>
      <FormControl size="small" fullWidth>
        <InputLabel id="dropdown-size-label">Size</InputLabel>
        <Select labelId="dropdown-size-label" value={value} label="Size" onChange={onChange}>
          <MenuItem value="short">Short</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="long">Long</MenuItem>
        </Select>
      </FormControl>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ ...hintTextSx, mt: 0.5, display: 'block' }}
      >
        Adjust the length of the lists in setup selectors.
      </Typography>
    </Box>
  );
}
