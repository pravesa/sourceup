import {Box, Card, Stack, useTheme} from '@mui/material';
import {ReactNode} from 'react';
import AppLogo from '../../AppLogo';

/**
 * Layout component for rendering account related component as children.
 */
const AccountPageLayout = (props: {children: ReactNode}) => {
  const theme = useTheme();

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{width: '100%', height: '100%'}}
    >
      <Card
        sx={{
          width: {xs: '94%'},
          maxWidth: 380,
          px: {sm: 1},
          py: 2,
          my: 8,
          boxShadow: {xs: 'none', sm: theme.shadows[5]},
          overflow: 'auto',
        }}
      >
        <Box mt={2} top="24px" left="24px">
          <AppLogo sx={{width: '100%'}} />
        </Box>
        {props.children}
      </Card>
    </Stack>
  );
};

export default AccountPageLayout;
