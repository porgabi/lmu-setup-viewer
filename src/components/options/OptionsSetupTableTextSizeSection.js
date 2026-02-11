import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { setupTableTextSizeOptions } from '../../domain/setupTableTextSize';
import { hintTextSx } from './hintTextStyles';

export default function OptionsSetupTableTextSizeSection({ value, onChange }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        Setup table text size
      </Typography>
      <FormControl size="small" fullWidth>
        <InputLabel id="setup-table-text-size-label">Size</InputLabel>
        <Select
          labelId="setup-table-text-size-label"
          value={value}
          label="Size"
          onChange={onChange}
        >
          {setupTableTextSizeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ ...hintTextSx, mt: 0.5, display: 'block' }}
      >
        Adjust font size in setup view tables.
      </Typography>
    </Box>
  );
}
