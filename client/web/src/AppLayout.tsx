import {Menu} from '@mui/icons-material';
import {CircularProgress, IconButton, Stack} from '@mui/material';
import {Suspense, useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {AlertDialog, SideBar, TitleBar} from './components';
import {storage} from './lib';
import {useAppDispatch} from './redux-hooks';
import {setInventory} from './routes/inventory/slices/inventorySlice';
import {ServerResponse, ResponseAlert} from './types';

function AppLayout() {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  useEffect(() => {
    const inventory = storage.get('inventory');
    if (!inventory) {
      fetch('/s/api/inventory/get-inventory', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      })
        .then((response: Response) => response.json())
        .then((res: ServerResponse) => {
          if (res.status === 200) {
            dispatch(setInventory(res.payload));
            storage.set('inventory', res.payload ?? {});
          }
        })
        .catch((err: Error) => {
          setAlert({
            message: err.message,
            severity: 'error',
          } as ResponseAlert);
        });
    } else {
      dispatch(setInventory(inventory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = () => {
    setOpenSideBar(true);
  };

  const handleClose = () => {
    setOpenSideBar(false);
  };

  const handleAlertClose = () => {
    setAlert(undefined);
  };

  return (
    <Stack direction="row" height="100%" bgcolor="#f4f6f8">
      {alert && (
        <AlertDialog
          dialogProps={{open: true}}
          {...alert}
          onClose={handleAlertClose}
        />
      )}
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
