import React from 'react';
import { Box, ButtonBase, Checkbox, Typography } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';

const VirtualizedMenuList = React.forwardRef(function VirtualizedMenuList(props, ref) {
  const {
    children,
    maxHeight = 320,
    rowHeight = 40,
    overscan = 4,
    initialScrollIndex,
    sectionIndexItems = [],
    classFilterItems = [],
    onClassFilterChange,
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
  const hasClassFilter = classFilterItems.length > 0;

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

  const useHorizontalWheelScroll = () => {
    const cleanupRef = React.useRef(null);

    return React.useCallback((node) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (!node) return;

      const handleWheel = (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
          return;
        }
        event.preventDefault();
        node.scrollLeft += event.deltaY;
      };

      node.addEventListener('wheel', handleWheel, { passive: false });
      cleanupRef.current = () => node.removeEventListener('wheel', handleWheel);
    }, []);
  };

  const sectionBarRef = useHorizontalWheelScroll();
  const classBarRef = useHorizontalWheelScroll();

  const sectionBar = hasSectionIndex ? (
    <Box
      ref={sectionBarRef}
      sx={{
        px: 1,
        py: 0.9,
        mt: 0.5,
        minHeight: 40,
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
            py: 0.3,
            my: 0.15,
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

  const classFilterBar = hasClassFilter ? (
    <Box
      ref={classBarRef}
      sx={{
        px: 1,
        py: 0.75,
        minHeight: 38,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(8, 10, 14, 0.9)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.6,
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
      {classFilterItems.map((item) => (
        <ButtonBase
          key={`class-${item.key}`}
          onClick={() => {
            if (!onClassFilterChange) return;
            const next = classFilterItems
              .map((entry) =>
                entry.key === item.key ? { ...entry, checked: !entry.checked } : entry
              )
              .filter((entry) => entry.checked)
              .map((entry) => entry.key);
            onClassFilterChange(next);
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.4,
            px: 0.6,
            py: 0.3,
            borderRadius: 999,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: item.checked
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(255, 255, 255, 0.04)',
            whiteSpace: 'nowrap',
            flex: '0 0 auto',
            '&:hover': {
              backgroundColor: item.checked
                ? 'rgba(255, 255, 255, 0.16)'
                : 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Checkbox
            size="small"
            checked={item.checked}
            sx={{ p: 0, color: 'rgba(255, 255, 255, 0.65)' }}
          />
          {item.icon ? (
            <Box
              component="img"
              src={item.icon}
              alt={`${item.label} icon`}
              sx={{ width: '1.6em', height: '1.2em', objectFit: 'contain' }}
            />
          ) : null}
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
        {classFilterBar}
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
      {classFilterBar}
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
