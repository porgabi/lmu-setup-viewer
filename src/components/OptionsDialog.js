import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '../state/SettingsContext';
import { useSetupContext } from '../state/SetupContext';
import { electron } from '../services/electron';
import OptionsDiffHighlightSection from './options/OptionsDiffHighlightSection';
import OptionsFeedbackSection from './options/OptionsFeedbackSection';
import OptionsHotkeysSection from './options/OptionsHotkeysSection';
import OptionsListSizeSection from './options/OptionsListSizeSection';
import OptionsLmuFolderSection from './options/OptionsLmuFolderSection';
import OptionsSortingOrderSection from './options/OptionsSortingOrderSection';
import OptionsSetupTableTextSizeSection from './options/OptionsSetupTableTextSizeSection';
import OptionsUpdatesOnLaunchSection from './options/OptionsUpdatesOnLaunchSection';
import OptionsUpdatesSection from './options/OptionsUpdatesSection';
import OptionsWindowSection from './options/OptionsWindowSection';
import OptionsZoomSection from './options/OptionsZoomSection';

export default function OptionsDialog({ open, onClose }) {
  const feedbackEmail = 'lmu.setupviewer@gmail.com';
  const { settings, loadingSettings, updateSettings } = useSettings();
  const { lmuPath, chooseLmuPath } = useSetupContext();
  const [draft, setDraft] = React.useState(settings);
  const [sortOrder, setSortOrder] = React.useState(settings.dropdownSortOrder);
  const [checkingUpdates, setCheckingUpdates] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [updateInfo, setUpdateInfo] = React.useState(null);
  const [showChangelog, setShowChangelog] = React.useState(false);
  const [currentVersion, setCurrentVersion] = React.useState(null);
  const [platform, setPlatform] = React.useState(null);
  const launchUpdateCheckRef = React.useRef(false);
  const checkUpdatesOnLaunchAtStartupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;

    setDraft(settings);
    setSortOrder(settings.dropdownSortOrder);

    let cancelled = false;
    const loadVersion = async () => {
      const version = await electron.getAppVersion();
      if (!cancelled) {
        setCurrentVersion(version);
      }
    };
    const loadPlatform = async () => {
      const nextPlatform = await electron.getPlatform();
      if (!cancelled) {
        setPlatform(nextPlatform);
      }
    };
    loadVersion();
    loadPlatform();

    return () => {
      cancelled = true;
    };
  }, [open, settings]);

  React.useEffect(() => {
    if (loadingSettings) return;
    if (checkUpdatesOnLaunchAtStartupRef.current == null) {
      checkUpdatesOnLaunchAtStartupRef.current = Boolean(settings.checkUpdatesOnLaunch);
    }
  }, [loadingSettings, settings.checkUpdatesOnLaunch]);

  React.useEffect(() => {
    if (loadingSettings) return;
    if (!checkUpdatesOnLaunchAtStartupRef.current) return;
    if (launchUpdateCheckRef.current) return;

    launchUpdateCheckRef.current = true;

    const runCheck = async () => {
      if (checkingUpdates) return;
      setCheckingUpdates(true);
      setShowChangelog(false);
      try {
        const result = await electron.checkForUpdates();
        if (!result || result.error || !result.hasUpdate) return;
        setUpdateInfo({
          status: 'available',
          latestVersion: result.latestVersion,
          currentVersion: result.currentVersion,
          url: result.url,
          notes: result.notes,
        });
        setUpdateDialogOpen(true);
      } catch (error) {
        console.warn('Update check on launch failed', error);
      } finally {
        setCheckingUpdates(false);
      }
    };

    runCheck();
  }, [checkingUpdates, loadingSettings]);

  React.useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    let timerId = null;

    const pollZoom = async () => {
      const zoomFactor = await electron.getZoomFactor();
      if (cancelled) return;
      if (zoomFactor == null) {
        timerId = setTimeout(pollZoom, 600);
        return;
      }
      const current = Number(draft.zoomFactor || 1);
      if (Math.abs(current - zoomFactor) >= 0.001) {
        setDraft((prev) => ({ ...prev, zoomFactor }));
        updateSettings({ zoomFactor });
      }
      timerId = setTimeout(pollZoom, 600);
    };

    pollZoom();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [open, draft.zoomFactor, updateSettings]);

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

  const handleCheckUpdates = async () => {
    if (checkingUpdates) return;
    setCheckingUpdates(true);
    const result = await electron.checkForUpdates();
    setCheckingUpdates(false);
    setShowChangelog(false);

    if (!result) {
      setUpdateInfo({ status: 'error', message: 'Update check failed.' });
      setUpdateDialogOpen(true);
      return;
    }

    if (result.error) {
      setUpdateInfo({ status: 'error', message: result.error });
      setUpdateDialogOpen(true);
      return;
    }

    if (result.hasUpdate) {
      setUpdateInfo({
        status: 'available',
        latestVersion: result.latestVersion,
        currentVersion: result.currentVersion,
        url: result.url,
        notes: result.notes,
      });
      setUpdateDialogOpen(true);
      return;
    }

    setUpdateInfo({
      status: 'upToDate',
      latestVersion: result.latestVersion,
      currentVersion: result.currentVersion,
    });
    setUpdateDialogOpen(true);
  };

  const handleDownloadUpdate = async () => {
    if (!updateInfo?.url) return;
    if (electron?.openExternal) {
      await electron.openExternal(updateInfo.url);
      return;
    }
    window.open(updateInfo.url, '_blank', 'noopener');
  };

  const updateNotes = updateInfo?.notes?.trim() || '';
  const showChangelogToggle = updateInfo?.status === 'available' && updateNotes.length > 0;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
        <DialogTitle>Options</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <OptionsLmuFolderSection lmuPath={lmuPath} onChoose={chooseLmuPath} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <OptionsDiffHighlightSection
                checked={draft.diffHighlightEnabled}
                onChange={handleToggle('diffHighlightEnabled')}
              />
              <OptionsUpdatesOnLaunchSection
                checkUpdates={draft.checkUpdatesOnLaunch}
                onCheckUpdatesChange={handleToggle('checkUpdatesOnLaunch')}
                minimizeToTrayOnClose={draft.minimizeToTrayOnClose}
                onMinimizeToTrayChange={handleToggle('minimizeToTrayOnClose')}
                startOnLogin={draft.startOnLogin}
                onStartOnLoginChange={handleToggle('startOnLogin')}
                showStartOnLogin={platform === 'win32'}
              />
              <OptionsWindowSection
                startMinimized={draft.startMinimized}
                onStartMinimizedChange={handleToggle('startMinimized')}
                alwaysOnTop={draft.alwaysOnTop}
                onAlwaysOnTopChange={handleToggle('alwaysOnTop')}
              />
            </Box>
            <OptionsSortingOrderSection sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
            <OptionsListSizeSection
              value={draft.dropdownListSize}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, dropdownListSize: event.target.value }))
              }
            />
            <OptionsZoomSection
              zoomFactor={draft.zoomFactor}
              onZoomChange={(nextZoom) => {
                setDraft((prev) => ({ ...prev, zoomFactor: nextZoom }));
                updateSettings({ zoomFactor: nextZoom });
              }}
            />
            <OptionsSetupTableTextSizeSection
              value={draft.setupTableTextSize}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, setupTableTextSize: event.target.value }))
              }
            />
            <OptionsHotkeysSection />
            <OptionsUpdatesSection
              onCheckUpdates={handleCheckUpdates}
              checking={checkingUpdates}
              currentVersion={currentVersion}
            />
            <OptionsFeedbackSection feedbackEmail={feedbackEmail} />
          </Box>
        </DialogContent>
        <DialogActions>
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
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        disableScrollLock
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 'min(760px, calc(100vw - 48px))',
            maxWidth: '760px',
          },
        }}
      >
        <DialogTitle>
          {updateInfo?.status === 'available'
            ? 'Update available'
            : updateInfo?.status === 'upToDate'
              ? 'App is up to date'
              : 'Update check failed'}
        </DialogTitle>
        <DialogContent dividers>
          {updateInfo?.status === 'available' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                A newer version ({updateInfo.latestVersion}) is available. Current version is{' '}
                {updateInfo.currentVersion}.
              </Typography>
              {showChangelogToggle ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowChangelog((prev) => !prev)}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {showChangelog ? 'Hide release notes' : 'Show release notes'}
                </Button>
              ) : null}
              {showChangelog ? (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                     backgroundColor: 'rgba(255, 255, 255, 0.04)',
                     border: '1px solid rgba(255, 255, 255, 0.08)',
                     maxHeight: 420,
                     overflowY: 'auto',
                   }}
                 >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <Typography variant="body2" sx={{ mb: 1 }} {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <Box component="ul" sx={{ pl: 2, mb: 1 }} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <Box component="ol" sx={{ pl: 2, mb: 1 }} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <Box component="li" sx={{ mb: 0.5 }} {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <Box
                          component="a"
                          {...props}
                          target="_blank"
                          rel="noreferrer"
                          sx={{ color: '#bcd7ff', textDecoration: 'underline' }}
                        />
                      ),
                      code: ({ node, inline, ...props }) => (
                        <Box
                          component="code"
                          sx={{
                            px: inline ? 0.4 : 0,
                            py: inline ? 0.1 : 0,
                            borderRadius: 0.5,
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            fontFamily: '"JetBrains Mono", "Consolas", "Courier New", monospace',
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {updateNotes}
                  </ReactMarkdown>
                </Box>
              ) : null}
            </Box>
          ) : null}
          {updateInfo?.status === 'upToDate' ? (
            <Typography variant="body2" color="text.secondary">
              You are running the latest version ({updateInfo.currentVersion}).
            </Typography>
          ) : null}
          {updateInfo?.status === 'error' ? (
            <Typography variant="body2" color="error">
              {updateInfo.message || 'Update check failed.'}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Close</Button>
          {updateInfo?.status === 'available' ? (
            <Button
              onClick={handleDownloadUpdate}
              variant="contained"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: '#f2f4f7',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.45)',
                },
              }}
            >
              Download
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
}
