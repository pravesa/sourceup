import {Tabs, Tab, Box, Divider, Stack} from '@mui/material';
import {useState} from 'react';
import {TabPanel} from '../../components';
import Profile from './Profile';

const Settings = () => {
  const [currentTab, setCurrentTab] = useState<string>('profile');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Stack width="100%" flexGrow={1} gap={2}>
      <Box px={{xs: 1.5, sm: 3}}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
        >
          <Tab label="profile" value="profile" />
        </Tabs>
        <Divider />
        <TabPanel value={currentTab} index="profile">
          <Profile />
        </TabPanel>
      </Box>
    </Stack>
  );
};

export default Settings;
