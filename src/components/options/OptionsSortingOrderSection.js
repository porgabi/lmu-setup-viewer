import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Typography,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconSlot from '../IconSlot';
import { getAssetPath } from '../../domain/assetPaths';
import { hintTextSx } from './hintTextStyles';

function SortableItem({ id, label, iconSrc }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      divider
      secondaryAction={null}
      sx={{ cursor: 'grab' }}
      aria-label={label}
      {...attributes}
      {...listeners}
    >
      <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
        <DragIndicatorIcon fontSize="small" />
      </ListItemIcon>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconSlot src={iconSrc} width="1.6em" height="1.2em" mr={0} />
      </Box>
    </ListItem>
  );
}

export default function OptionsSortingOrderSection({ sortOrder, onSortOrderChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Setup sorting order
      </Typography>
      <Paper variant="outlined" sx={{ backgroundColor: 'rgba(10, 12, 18, 0.5)' }}>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            onSortOrderChange((current) => {
              const oldIndex = current.indexOf(active.id);
              const newIndex = current.indexOf(over.id);
              if (oldIndex === -1 || newIndex === -1) return current;

              return arrayMove(current, oldIndex, newIndex);
            });
          }}
        >
          <SortableContext items={sortOrder} strategy={verticalListSortingStrategy}>
            <List disablePadding>
              {sortOrder.map((item) => (
                <SortableItem
                  key={item}
                  id={item}
                  label={item}
                  iconSrc={getAssetPath(`assets/classes/${item}.png`)}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Paper>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ ...hintTextSx, mt: 0.5, display: 'block' }}
      >
        Drag and drop to change the order of setups in the setup selectors.
      </Typography>
    </Box>
  );
}
