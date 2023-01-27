import {ArrowForwardOutlined} from '@mui/icons-material';
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import {FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {object, ref, string} from 'yup';
import {AlertDialog, FormInput} from '../../components';
import {useFetch, useValidate} from '../../lib';
import type {FieldProps, ResponseAlert, ServerResponse} from '../../types';
import AccountPageLayout from './AccountPageLayout';

/**
 * Yup validation schema for signup form
 */
const schema = object({
  gstn: string()
    .required('GST No is required')
    .matches(/^(\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z][a-zA-Z0-9]{3})$/i, {
      excludeEmptyString: true,
      message: 'Enter a valid GST No.',
    }),
  mail: string()
    .required('Email address is required')
    .email('Enter a valid mail address (eg: someone@domain.com)'),
  pwd: string().required().min(8, 'Password must be at least 8 charaters'),
  cnfPwd: string().oneOf([ref('pwd')], "Password doesn't match"),
});

/**
 * Initial values for controlled signup form component.
 */
const initialValues = {
  gstn: '',
  mail: '',
  pwd: '',
  cnfPwd: '',
};

/**
 * Signup component renders a form for registering new user by collecting user data and sending it to server.
 */
const SignupPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, fieldErrors, handleValue, _handleReset, formError] =
    useValidate(initialValues, schema);

  const [fetchData, isPending] = useFetch();
  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  const navigate = useNavigate();

  /**
   * Field properties for signup form.
   */
  const fields: {[k: string]: FieldProps} = {
    gstn: {
      name: 'gstn',
      label: 'GST No',
      placeholder: 'Type your GST no',
    },
    mail: {
      name: 'mail',
      label: 'Email ID',
      placeholder: 'eg: juju@somedomain.com',
    },
    pwd: {
      name: 'pwd',
      label: 'Password',
      placeholder: 'Enter Password',
    },
    cnfPwd: {
      name: 'cnfPwd',
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
    },
  };

  /**
   * Controlled values and field errors validated with yup validation schema.
   */
  const data = {
    value: values,
    inputErr: fieldErrors,
  };

  const handleAlertClose = () => {
    setAlert(undefined);
  };

  const isSignUpDisabled = () => {
    return !formError.completed || isPending;
  };

  /**
   * Handles server interaction with fetch api upon submit event.
   * @param event FormEvent
   */
  const authenticateUser = (event: FormEvent) => {
    event.preventDefault();

    fetchData({
      url: '/s/api/account/signup',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      // Payload property of request's body holds the data that will be processed by server and stored in database.
      body: JSON.stringify({payload: {...values}}),
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        setAlert({...res, severity: res.status === 201 ? 'success' : 'error'});
        if (res.status === 201) {
          setTimeout(() => {
            // Redirect user to signin page after registration
            navigate('/signin', {replace: true});
          }, 4000);
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
            Register to Get Started
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
              {...fields.gstn}
              onChange={(e) => handleValue(e.target)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
            />
            <FormInput
              {...data}
              {...fields.mail}
              onChange={(e) => handleValue(e.target)}
            />
            <FormInput
              {...data}
              type="password"
              {...fields.pwd}
              onChange={(e) => handleValue(e.target, {}, ['cnfPwd'])}
            />
            <FormInput
              {...data}
              type="password"
              {...fields.cnfPwd}
              onChange={(e) => handleValue(e.target)}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSignUpDisabled()}
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
            Sign up
          </Button>
        </Stack>
      </CardContent>
    </AccountPageLayout>
  );
};

export default SignupPage;
