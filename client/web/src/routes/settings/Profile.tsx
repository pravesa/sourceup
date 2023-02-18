import {DoneOutlined} from '@mui/icons-material';
import {Stack, Button, Typography, Box, CircularProgress} from '@mui/material';
import {useState} from 'react';
import {object, string} from 'yup';
import {AlertDialog, FormInput} from '../../components';
import {storage, useFetch, useValidate} from '../../lib';
import {useAppDispatch, useAppSelector} from '../../redux-hooks';
import {ResponseAlert, FieldProps, ServerResponse} from '../../types';
import HeadOfficeAddress from './profile/HeadOfficeAddress';
import PlantAddress from './profile/PlantAddress';
import RegisteredAddress from './profile/RegisteredAddress';
import WarehouseAddress from './profile/WarehouseAddress';
import {getProfile, setGeneral} from './slices/profileSlice';

const schema = object({
  name: string().required('Company Name is required'),
  mail: string().email('Enter a valid mail address').optional(),
});

const Profile = () => {
  const {name, mail, regd, head, plant, warehouse, isHeadSameAsRegd} =
    useAppSelector(getProfile);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, fieldErrors, handleValue, _handleReset, formError] =
    useValidate({name, mail: mail.sec}, schema);

  const [fetchData, isPending] = useFetch();

  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  /**
   * Field properties for profile form.
   */
  const fields: {[k: string]: FieldProps} = {
    name: {
      name: 'name',
      label: 'Company Name',
      placeholder: 'Enter your company name',
      required: true,
    },
    mail: {
      name: 'mail',
      label: 'Secondary Mail',
      placeholder: 'eg: juju@somedomain.com',
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

  const handleSave = () => {
    dispatch(setGeneral(values));

    const data = {name, mail, regd, head, plant, warehouse, isHeadSameAsRegd};

    fetchData({
      url: '/s/api/settings/profile',
      method: 'POST',
      headers: {
        accepts: 'application/json',
        'content-type': 'application/json',
      },
      // Payload property of request's body holds the data that will be processed by server for user authentication.
      body: JSON.stringify({
        payload: data,
      }),
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        if (res.status === 200) {
          storage.set('profile', data);
          setAlert({...res, severity: 'success'});
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

  const isRegdAddressEmpty = () => {
    return regd === undefined;
  };

  const isHeadAddressEmpty = () => {
    return head === undefined;
  };

  const isPlantAddressEmpty = () => {
    return plant ? Object.keys(plant).length === 0 : true;
  };

  const isSaveDisabled = () => {
    return (
      (!formError.completed && name === '') ||
      isRegdAddressEmpty() ||
      isHeadAddressEmpty() ||
      isPlantAddressEmpty() ||
      isPending
    );
  };

  return (
    <Stack gap={5} py={3}>
      {alert && (
        <AlertDialog
          dialogProps={{open: true}}
          {...alert}
          onClose={handleAlertClose}
        />
      )}
      <Stack gap={3}>
        <Typography variant="h6">General</Typography>
        <Stack maxWidth={{sm: 400}} spacing={2}>
          <FormInput
            {...data}
            {...fields.name}
            onChange={(e) => handleValue(e.target)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
          />
          <FormInput
            {...data}
            {...fields.mail}
            onChange={(e) => handleValue(e.target)}
          />
        </Stack>
      </Stack>
      <RegisteredAddress isFieldError={isRegdAddressEmpty()} />
      <HeadOfficeAddress isFieldError={isHeadAddressEmpty()} />
      <PlantAddress isFieldError={isPlantAddressEmpty()} />
      <WarehouseAddress isFieldError={false} />
      <Stack direction="row" gap={2}>
        <Button
          variant="contained"
          disabled={isSaveDisabled()}
          onClick={handleSave}
          startIcon={
            isPending ? (
              <Box display="flex">
                <CircularProgress size={25} disableShrink={true} />
              </Box>
            ) : (
              <DoneOutlined />
            )
          }
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default Profile;
