import React from 'react';
import { Box } from '@mui/material';

const VirtualizedMenuList = React.forwardRef(function VirtualizedMenuList(props, ref) {
  const {
    children,
    maxHeight = 320,
    rowHeight = 40,
    overscan = 4,
    sx,
    ...rest
  } = props;
  
  const items = React.useMemo(() => React.Children.toArray(children), [children]);
  const [scrollTop, setScrollTop] = React.useState(0);

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const totalHeight = items.length * rowHeight;
  const visibleCount = Math.ceil(maxHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * rowHeight;

  if (items.length <= visibleCount + overscan * 2) {
    return (
      <Box ref={ref} sx={[{ maxHeight, overflowY: 'auto' }, sx]} {...rest}>
        {children}
      </Box>
    );
  }

  return (
    <Box ref={ref} onScroll={handleScroll} sx={[{ maxHeight, overflowY: 'auto' }, sx]} {...rest}>
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
