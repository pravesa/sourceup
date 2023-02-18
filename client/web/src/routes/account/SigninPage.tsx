import {ArrowForwardOutlined} from '@mui/icons-material';
import {
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
  CardContent,
} from '@mui/material';
import {useState, FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {object, string} from 'yup';
import {
  AlertDialog,
  ButtonRouter,
  FormInput,
  ToggleVisibility,
} from '../../components';
import {useValidate, useFetch, storage} from '../../lib';
import {useAppDispatch} from '../../redux-hooks';
import {FieldProps, ServerResponse, ResponseAlert} from '../../types';
import {setProfile} from '../settings/slices/profileSlice';
import AccountPageLayout from './AccountPageLayout';
import {useAuth} from './UserAccount';

// Yup validation schema for signin form
const schema = object({
  _id: string()
    .required('Email address is required')
    .email('Enter a valid mail address'),
  pwd: string().required().min(8, 'Password must be at least 8 charaters'),
});

// Initial values for controlled signin form component used by useValidate hook.
const initialValues = {
  _id: '',
  pwd: '',
};

/**
 * Signin component renders a form for authenticating an user with server.
 */
const SigninPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, fieldErrors, handleValue, handleReset, formError] =
    useValidate(initialValues, schema);
  const [hidden, setHidden] = useState(true);
  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  const dispatch = useAppDispatch();

  // Method for updating user context
  const {updateUser} = useAuth();
  const navigate = useNavigate();

  const [fetchData, isPending] = useFetch();

  // Field properties for signin form.
  const fields: {[k: string]: FieldProps} = {
    _id: {
      name: '_id',
      label: 'Email ID',
      placeholder: 'eg: juju@somedomain.com',
    },
    pwd: {
      name: 'pwd',
      label: 'Password',
      placeholder: 'Enter Password',
    },
  };

  // Controlled values and field errors validated with yup validation schema.
  const data = {
    value: values,
    inputErr: fieldErrors,
  };

  // Handles alert component state by setting it to undefined upon onClose
  const handleAlertClose = () => {
    setAlert(undefined);
  };

  // Disables signin button for field errors, fetch pending state and response status 200
  const isSignInDisabled = () => {
    return !formError.completed || alert?.status === 200 || isPending;
  };

  /**
   * Handles server interaction with signin endpoint upon submit event.
   * @param event FormEvent
   */
  const authenticateUser = (event: FormEvent) => {
    event.preventDefault();

    fetchData({
      url: '/s/api/account/signin',
      method: 'POST',
      headers: {
        accepts: 'application/json',
        'content-type': 'application/json',
      },
      // Payload property of request's body holds the data that will be processed by server for user authentication.
      body: JSON.stringify({payload: values}),
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        if (res.status === 200) {
          // Set user context with authenticated user
          updateUser({...res.payload, isSignedIn: true}, () => {
            dispatch(setProfile(res.payload));
            storage.set('profile', {...res.payload});
            // Navigate to home page on status 200
            navigate('/', {replace: true});
          });
        } else {
          setAlert({...res, severity: 'error'});
          // Reset the field for 404 or 401 status
          if (res.status === 404) {
            handleReset();
          } else if (res.status === 401) {
            handleReset({...values, pwd: ''});
          }
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
    <AccountPageLayout>
      {alert && (
        <AlertDialog
          dialogProps={{open: true}}
          {...alert}
          onClose={handleAlertClose}
        />
      )}
      <CardContent component={Stack} alignItems="stretch" gap={4}>
        <Stack sx={{lineHeight: 1}} gap={2}>
          <Typography variant="h6" textAlign="center">
            Sign in to continue
          </Typography>
        </Stack>
        <Stack
          component="form"
          gap={4}
          onSubmit={(e: FormEvent) => authenticateUser(e)}
        >
          <Stack alignItems="stretch" spacing={2}>
            <FormInput
              {...data}
              {...fields._id}
              onChange={(e) => handleValue(e.target)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
            />
            <FormInput
              sx={{mt: 4}}
              type={hidden ? 'password' : 'text'}
              {...data}
              {...fields.pwd}
              onChange={(e) => handleValue(e.target)}
              InputProps={{
                endAdornment: (
                  <ToggleVisibility
                    state={hidden}
                    toggleState={() => setHidden(!hidden)}
                  />
                ),
              }}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSignInDisabled()}
            endIcon={
              isPending ? (
                <Box display="flex">
                  <CircularProgress size={25} disableShrink={true} />
                </Box>
              ) : (
                <ArrowForwardOutlined />
              )
            }
          >
            Sign in
          </Button>
          <Typography variant="body2">
            Not Yet Registered ?{' '}
            <ButtonRouter to="/signup" endIcon={<ArrowForwardOutlined />}>
              Create Account
            </ButtonRouter>
          </Typography>
        </Stack>
      </CardContent>
    </AccountPageLayout>
  );
};

export default SigninPage;
