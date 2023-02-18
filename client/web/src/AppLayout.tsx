import {Menu} from '@mui/icons-material';
import {CircularProgress, IconButton, Stack} from '@mui/material';
import {Suspense, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {SideBar, TitleBar} from './components';

function AppLayout() {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  const handleOpen = () => {
    setOpenSideBar(true);
  };

  const handleClose = () => {
    setOpenSideBar(false);
  };

  return (
    <Stack direction="row" height="100%" bgcolor="#f4f6f8">
      <Stack component="nav">
        <SideBar open={openSideBar} onClose={handleClose}></SideBar>
      </Stack>
      <Stack flexGrow={1} alignItems="stretch" gap={2} overflow="hidden">
        <TitleBar>
          <IconButton
            onClick={handleOpen}
            sx={{display: {xs: 'inline-block', md: 'none'}}}
          >
            <Menu />
          </IconButton>
        </TitleBar>
        <Suspense
          fallback={
            <Stack flexGrow={1} justifyContent="center" alignItems="center">
              <CircularProgress disableShrink={true} />
            </Stack>
          }
        >
          <Stack component="main" overflow="auto" flexGrow={1} pt={1} pb={2}>
            <Outlet />
          </Stack>
        </Suspense>
      </Stack>
    </Stack>
  );
}

export default AppLayout;
