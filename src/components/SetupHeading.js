import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';

function splitSetupKey(setupKey) {
  if (!setupKey) {
    return { track: '', setupName: '' };
  }

  const separatorIndex = setupKey.indexOf('/');
  if (separatorIndex === -1) {
    return { track: '', setupName: setupKey };
  }

  return {
    track: setupKey.slice(0, separatorIndex),
    setupName: setupKey.slice(separatorIndex + 1),
  };
}

function AutoFitCarName({ text }) {
  const containerRef = React.useRef(null);
  const textRef = React.useRef(null);
  const baseSizeRef = React.useRef(null);
  const lastSizeRef = React.useRef(null);
  const [fontSize, setFontSize] = React.useState(null);

  const fitText = React.useCallback(() => {
    if (!text || !containerRef.current || !textRef.current) return;
    const availableWidth = containerRef.current.clientWidth;
    
    const baseSize = parseFloat(window.getComputedStyle(textRef.current).fontSize);
    if (!baseSize) return;
    
    if (!baseSizeRef.current) {
      baseSizeRef.current = baseSize;
    }
    
    const textWidth = textRef.current.scrollWidth;
    if (!availableWidth || !textWidth) return;
    
    let nextSize = baseSize;

    const ratio = availableWidth / textWidth;
    if (ratio < 1) {
      nextSize = Math.max(baseSize * ratio, 12);
    } else if (baseSizeRef.current) {
      nextSize = Math.min(baseSizeRef.current, baseSize * ratio);
    }

    const nextValue = `${nextSize.toFixed(2)}px`;
    if (lastSizeRef.current !== nextValue) {
      lastSizeRef.current = nextValue;
      setFontSize(nextValue);
    }
  }, [text]);

  React.useLayoutEffect(() => {
    fitText();
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => fitText());
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [fitText]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: '4em',
      }}
    >
      <Typography
        ref={textRef}
        variant="h3"
        sx={{
          color: 'transparent',
          WebkitTextStroke: '0.6px rgba(255, 255, 255, 0.8)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 800,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          fontSize: fontSize || undefined,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function getCarImagePath(carInfo) {
  if (!carInfo?.class || !carInfo?.technical) return '';
  return `/assets/cars/${carInfo.class}/${carInfo.technical}.png`;
}

export default function SetupHeading({ title, setupKey, trackInfo, carInfo }) {
  if (!setupKey) {
    return title;
  }

  const { track, setupName } = splitSetupKey(setupKey);
  const trackEntry = track ? trackInfo?.[track] : null;
  const countryCode = trackEntry?.countryCode || null;
  const trackLabel = trackEntry?.displayName || track;
  const carName = carInfo?.displayName || '';
  const carImagePath = getCarImagePath(carInfo);
  const classIconPath = carInfo?.class ? `/assets/classes/${carInfo.class}.png` : '';
  const brandIconPath = carInfo?.brand ? `/assets/brands/${carInfo.brand}.png` : '';

  const label = track ? (
    <Box component="span">
      <Box component="span">{trackLabel}</Box>
      <Box component="span" sx={{ mx: 0.5 }}>
        /
      </Box>
      {classIconPath ? (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.2em',
            height: '1em',
            mr: 0.5,
            flex: '0 0 1.2em',
            verticalAlign: 'middle',
          }}
        >
          <Box
            component="img"
            src={classIconPath}
            alt=""
            aria-hidden
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
          />
        </Box>
      ) : null}
      {brandIconPath ? (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.4em',
            height: '1em',
            mr: 0.5,
            flex: '0 0 1.4em',
            verticalAlign: 'middle',
          }}
        >
          <Box
            component="img"
            src={brandIconPath}
            alt=""
            aria-hidden
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
          />
        </Box>
      ) : null}
      <Box component="span">{setupName}</Box>
    </Box>
  ) : (
    setupKey
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
      {carImagePath ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={carImagePath}
            alt={carName}
            sx={{ width: 'auto', height: 'auto', maxWidth: 'none', opacity: 0.95 }}
          />
        </Box>
      ) : null}
      {carName ? <AutoFitCarName text={carName} /> : null}
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        {countryCode ? (
          <ReactCountryFlag
            svg
            countryCode={countryCode}
            style={{ width: '1.1em', height: '1.1em', display: 'block' }}
            aria-label={`${countryCode} flag`}
          />
        ) : null}
        <Box component="span">{label}</Box>
      </Box>
    </Box>
  );
}
