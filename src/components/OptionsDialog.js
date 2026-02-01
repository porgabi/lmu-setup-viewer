import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSettings } from '../state/SettingsContext';
import { useSetupContext } from '../state/SetupContext';
import IconSlot from './IconSlot';

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

export default function OptionsDialog({ open, onClose }) {
  const { settings, loadingSettings, updateSettings, resetSettings } = useSettings();
  const { lmuPath, chooseLmuPath } = useSetupContext();
  const [draft, setDraft] = React.useState(settings);
  const [sortOrder, setSortOrder] = React.useState(settings.dropdownSortOrder);

  React.useEffect(() => {
    if (!open) return;

    setDraft(settings);
    setSortOrder(settings.dropdownSortOrder);
  }, [open, settings]);

  const handleToggle = (key) => (event) => {
    setDraft((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleSave = async () => {
    const next = {
      ...draft,
      dropdownSortOrder: sortOrder,
    };

    await updateSettings(next);
    onClose?.();
  };

  const handleReset = async () => {
    await resetSettings();
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Options</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              LMU Folder
            </Typography>
            <Button variant="outlined" size="small" onClick={chooseLmuPath}>
              Set LMU Folder
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Current path: {lmuPath || '(not set)'}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={draft.diffHighlightEnabled}
                onChange={handleToggle('diffHighlightEnabled')}
              />
            }
            label="Highlight differences"
          />
          <FormControlLabel
            control={
              <Switch
                checked={draft.checkUpdatesOnLaunch}
                onChange={handleToggle('checkUpdatesOnLaunch')}
              />
            }
            label="Check for updates on launch"
          />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Setup sorting order
            </Typography>
            <Paper variant="outlined" sx={{ backgroundColor: 'rgba(10, 12, 18, 0.5)' }}>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;

                  setSortOrder((current) => {
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
                        iconSrc={`/assets/classes/${item}.png`}
                      />
                    ))}
                  </List>
                </SortableContext>
              </DndContext>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Drag and drop to change the order of setups in the setup selectors.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Updates
            </Typography>
            <Button variant="outlined" size="small" disabled>
              Check for updates
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary" disabled={loadingSettings}>
          Restore Defaults
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loadingSettings}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: '#f2f4f7',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
