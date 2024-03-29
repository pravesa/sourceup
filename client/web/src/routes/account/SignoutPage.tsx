import {PowerSettingsNewOutlined} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {useState} from 'react';
import {AlertDialog, ButtonRouter} from '../../components';
import {storage, useFetch} from '../../lib';
import {useAppDispatch} from '../../redux-hooks';
import {ResponseAlert, ServerResponse} from '../../types';
import {resetUser} from './slices/userSlice';

const SignOut = () => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  const [fetchData] = useFetch();
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handles alert component state by setting it to undefined upon onClose
  const handleAlertClose = () => {
    setAlert(undefined);
  };

  const handleSignout = () => {
    fetchData({
      url: '/s/api/account/signout',
      method: 'DELETE',
      headers: {
        acceps: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        if (res.status === 200) {
          storage.clear();
          dispatch(resetUser({}));
        } else {
          setAlert({...res, severity: 'error'});
        }
      })
      .catch((err: Error) => {
        setAlert({
          message: err.message,
          severity: 'error',
        } as ResponseAlert);
      });
  };

  return (
    <>
      {alert && (
        <AlertDialog
          dialogProps={{open: true}}
          {...alert}
          onClose={handleAlertClose}
        />
      )}
      <Tooltip title="Signout">
        <IconButton onClick={handleOpen}>
          <PowerSettingsNewOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={open}>
        <DialogTitle>Signout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure, you want to signout from this device?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            No
          </Button>
          <ButtonRouter to="/" onClick={handleSignout}>
            Yes
          </ButtonRouter>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignOut;
