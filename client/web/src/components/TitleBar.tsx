import {Paper, Stack, Toolbar} from '@mui/material';
import {ReactNode} from 'react';
import {SignoutPage} from './../routes/account';

type TitleBarProps = {
  children?: ReactNode;
};

const TitleBar = (props: TitleBarProps) => {
  return (
    <Paper component="header" sx={{borderRadius: 0}} elevation={0}>
      <Toolbar>
        {props.children}
        {/* <ButtonRouter
          to="/"
          disableRipple
          sx={{
            padding: "12px 0",
            display: { xs: "block", md: "none" },
          }}
        >
          <AppLogo sx={{ width: "100%" }} />
        </ButtonRouter> */}
        <Stack direction="row" ml="auto" columnGap={0.5}>
          <SignoutPage />
        </Stack>
      </Toolbar>
    </Paper>
  );
};

export default TitleBar;
