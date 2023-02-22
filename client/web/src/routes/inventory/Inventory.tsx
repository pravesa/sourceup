import {Tabs, Tab, Box, Divider, Stack} from '@mui/material';
import {useState} from 'react';
import {TabPanel} from '../../components';
import RawMaterial from './RawMaterial';

const Inventory = () => {
  const [currentTab, setCurrentTab] = useState<string>('raw material');

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
          <Tab label="raw material" value="raw material" />
        </Tabs>
        <Divider />
        <TabPanel value={currentTab} index="raw material">
          <RawMaterial />
        </TabPanel>
      </Box>
    </Stack>
  );
};

export default Inventory;
