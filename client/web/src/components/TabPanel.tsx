import {Box, BoxProps} from '@mui/material';
import {ReactNode} from 'react';

/**
 * @typedef {Object} TabPanelProps
 * @param {ReactNode} props.children - The content to render in the tab panel.
 * @param {string} props.value - The value of the current tab.
 * @param {string} props.index - The value of the tab panel's index.
 */
type TabPanelProps = BoxProps & {
  children: ReactNode;
  value: string;
  index: string;
};

/**
 * A tab panel component for rendering content in a tabbed interface.
 * @param {TabPanelProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered tab panel component.
 */
const TabPanel = (props: TabPanelProps): JSX.Element => {
  const {children, value, index, ...otherProps} = props;

  return (
    <Box hidden={value !== index} flexGrow={1} overflow="auto" {...otherProps}>
      {value === index && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default TabPanel;
