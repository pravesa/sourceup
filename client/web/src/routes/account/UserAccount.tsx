import {Stack, CircularProgress} from '@mui/material';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {AlertDialog} from '../../components';
import {storage} from '../../lib';
import {useAppDispatch} from '../../redux-hooks';
import {ResponseAlert, ServerResponse} from '../../types';
import {setProfile} from '../settings/slices/profileSlice';

// User account properties
type UserProps = ServerResponse['payload'] & {
  isSignedIn: boolean;
};

// User context type
type UserContextProps = {
  user: UserProps;
  updateUser: (newValue: UserProps, callback?: () => void) => void;
};

// Initial value for initiating user context
const userInitial: UserProps = {isSignedIn: false};

// User context with the functionality to update the context
const UserContext = createContext<UserContextProps>({
  user: {...userInitial},
  updateUser: () => undefined,
});

// Sets user context with user account if session is found else redirects to signin page
const UserAccount = (props: {children: ReactNode}) => {
  const [user, setUser] = useState<UserProps>(userInitial);
  // Here fetch pending state is set to true by default to properly store user to UserContext and
  // avoid rendering children before fetching user session.
  const [isPending, setIsPending] = useState(true);

  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  const dispatch = useAppDispatch();

  // Method for updating user context from child components
  const updateUser = (newValue: UserProps, callback?: () => void) => {
    setUser(newValue);
    if (callback) {
      callback();
    }
  };

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
        if (res.status === 200) {
          updateUser({...payload, isSignedIn: true});

          const profile = storage.get('profile');
          if (profile) {
            dispatch(setProfile(profile));
          }
        } else if (res.status === 401) {
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

  // Value prop for context provider
  const value: UserContextProps = {user, updateUser};

  return (
    <UserContext.Provider value={value}>
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
    </UserContext.Provider>
  );
};

// Custom hook for accessing user context from child components
const useAuth = () => {
  return useContext(UserContext);
};

export {UserAccount as default, useAuth};
