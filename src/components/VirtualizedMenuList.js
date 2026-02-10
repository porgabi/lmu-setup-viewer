import React from 'react';
import { Box } from '@mui/material';

const VirtualizedMenuList = React.forwardRef(function VirtualizedMenuList(props, ref) {
  const {
    children,
    maxHeight = 320,
    rowHeight = 40,
    overscan = 4,
    initialScrollIndex,
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

  React.useEffect(() => {
    hasAppliedInitialScroll.current = false;
  }, [initialScrollIndex, items.length]);

  React.useEffect(() => {
    if (hasAppliedInitialScroll.current) return;
    if (initialScrollIndex == null || Number.isNaN(initialScrollIndex)) return;
    const target = Math.min(
      Math.max(Number(initialScrollIndex), 0),
      Math.max(items.length - 1, 0)
    );
    const nextScrollTop = target * rowHeight;
    setScrollTop(nextScrollTop);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = nextScrollTop;
    }
    hasAppliedInitialScroll.current = true;
  }, [initialScrollIndex, items.length, rowHeight]);

  if (items.length <= visibleCount + overscan * 2) {
    return (
      <Box
        ref={(node) => {
          scrollContainerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        sx={[{ maxHeight, overflowY: 'auto' }, sx]}
        {...rest}
      >
        {children}
      </Box>
    );
  }

  return (
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
      sx={[{ maxHeight, overflowY: 'auto' }, sx]}
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
  );
});

export default VirtualizedMenuList;
