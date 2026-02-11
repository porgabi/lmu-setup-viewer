import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';

const VirtualizedMenuList = React.forwardRef(function VirtualizedMenuList(props, ref) {
  const {
    children,
    maxHeight = 320,
    rowHeight = 40,
    overscan = 4,
    initialScrollIndex,
    sectionIndexItems = [],
    sx,
    ...rest
  } = props;
  
  const items = React.useMemo(() => React.Children.toArray(children), [children]);
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollContainerRef = React.useRef(null);
  const hasAppliedInitialScroll = React.useRef(false);

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const totalHeight = items.length * rowHeight;
  const visibleCount = Math.ceil(maxHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * rowHeight;
  const hasSectionIndex = sectionIndexItems.length > 0;

  const scrollToIndex = React.useCallback(
    (targetIndex) => {
      const safeTarget = Math.min(
        Math.max(Number(targetIndex) || 0, 0),
        Math.max(items.length - 1, 0)
      );
      const nextScrollTop = safeTarget * rowHeight;
      setScrollTop(nextScrollTop);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = nextScrollTop;
      }
    },
    [items.length, rowHeight]
  );

  React.useEffect(() => {
    hasAppliedInitialScroll.current = false;
  }, [initialScrollIndex, items.length]);

  React.useEffect(() => {
    if (hasAppliedInitialScroll.current) return;
    if (initialScrollIndex == null || Number.isNaN(initialScrollIndex)) return;
    scrollToIndex(initialScrollIndex);
    hasAppliedInitialScroll.current = true;
  }, [initialScrollIndex, items.length, scrollToIndex]);

  const sectionBarRef = React.useRef(null);

  React.useEffect(() => {
    const node = sectionBarRef.current;
    if (!node) return undefined;

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }
      event.preventDefault();
      node.scrollLeft += event.deltaY;
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const sectionBar = hasSectionIndex ? (
    <Box
      ref={sectionBarRef}
      sx={{
        px: 1,
        py: 0.75,
        mt: 0.5,
        minHeight: 38,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(8, 10, 14, 0.95)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'auto',
        overflowY: 'hidden',
        flexWrap: 'nowrap',
        overscrollBehavior: 'contain',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 999,
        },
      }}
    >
      {sectionIndexItems.map((section) => (
        <ButtonBase
          key={`section-${section.track}`}
          onClick={() => scrollToIndex(section.index)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.4,
            borderRadius: 999,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            whiteSpace: 'nowrap',
            flex: '0 0 auto',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {section.countryCode ? (
            <ReactCountryFlag
              svg
              countryCode={section.countryCode}
              style={{ width: '1em', height: '1em', display: 'block' }}
              aria-label={`${section.countryCode} flag`}
            />
          ) : null}
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '0.85rem' }}
          >
            {section.trackLabel}
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  ) : null;

  if (items.length <= visibleCount + overscan * 2) {
    return (
      <Box
        sx={[
          { maxHeight, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 },
          sx,
        ]}
      >
        {sectionBar}
        <Box
          ref={(node) => {
            scrollContainerRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          sx={{ flex: 1, overflowY: 'auto', width: '100%', minWidth: 0 }}
          {...rest}
        >
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={[
        { maxHeight, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 },
        sx,
      ]}
    >
      {sectionBar}
      <Box
        ref={(node) => {
          scrollContainerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onScroll={handleScroll}
        sx={{ flex: 1, overflowY: 'auto', width: '100%', minWidth: 0 }}
        {...rest}
      >
        <Box sx={{ height: totalHeight, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
            {items.slice(startIndex, endIndex).map((child, index) => (
              <Box
                key={child.key ?? `${startIndex + index}`}
                sx={{ height: rowHeight, display: 'flex', alignItems: 'center', width: '100%' }}
              >
                {child}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default VirtualizedMenuList;
