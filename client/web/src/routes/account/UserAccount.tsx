import {Stack, CircularProgress} from '@mui/material';
import {ReactNode, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AlertDialog} from '../../components';
import {useAppDispatch} from '../../redux-hooks';
import {ResponseAlert, ServerResponse} from '../../types';
import {setUser} from './slices/userSlice';

// Sets user if session is found else redirects to signin page
const UserAccount = (props: {children: ReactNode}) => {
  // Here fetch pending state is set to true by default to properly store user and
  // avoid rendering children before fetching user session.
  const [isPending, setIsPending] = useState(true);

  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const dispatch = useAppDispatch();

  // Fetch user account and set it to user context if session found.
  useEffect(() => {
    fetch('/s/api/verify-session', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        const {payload, ...resAlert} = res;
        const toPath =
          pathname === '/signin' || pathname === '/signup' ? '/' : pathname;

        if (res.status === 200) {
          dispatch(setUser(payload));
          navigate(toPath);
        } else if (res.status === 401) {
          navigate(pathname === '/signup' ? '/signup' : '/signin', {
            state: {from: toPath},
          });
          setAlert({
            ...resAlert,
            severity: 'error',
          });
        }
      })
      .catch((err: Error) => {
        setAlert({
          message: err.message,
          severity: 'error',
        } as ResponseAlert);
      })
      .finally(() => setIsPending(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handles alert component state by setting it to undefined upon onClose
  const handleAlertClose = () => {
    setAlert(undefined);
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
      {isPending ? (
        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress disableShrink={true} />
        </Stack>
      ) : (
        props.children
      )}
    </>
  );
};

export default UserAccount;
