import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function SetupViewer({ selectedSetup }) {
  const [fileContent, setFileContent] = React.useState('');

  React.useEffect(() => {
    if (!selectedSetup) return;

    const loadContent = async () => {
      try {
        const rootPath = await window.electronAPI.getLmuPath();
        const fullPath = `${rootPath}/UserData/player/Settings/${selectedSetup}.svm`;
        const content = await window.electronAPI.readFile(fullPath);
        setFileContent(content);
      } catch (error) {
        console.error('Error reading setup file:', error);
        setFileContent('(Error loading file)');
      }
    };

    loadContent();
  }, [selectedSetup]);

  return (
    // also display car name
    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
      {selectedSetup ? (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Viewing: {selectedSetup}
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderRadius: 1,
              maxHeight: 300,
              overflowY: 'auto',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {fileContent || '(Empty file)'}
          </Box>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No setup selected.
        </Typography>
      )}
    </Box>
  );
}
