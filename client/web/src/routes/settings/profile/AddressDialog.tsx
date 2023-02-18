import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import {useEffect} from 'react';
import {number, object, string} from 'yup';
import {FormInput} from '../../../components';
import {useValidate} from '../../../lib';
import {FieldProps} from '../../../types';

/**
 * @typedef {Object} AddressDialogProps
 * @property {boolean} open - Indicates whether the dialog is open
 * @property {Address} [initialValue] - The initial value of the Address object
 * @property {(data: Address) => void} onData - Function to call when the Save button is clicked with the entered data
 * @property {() => void} onCancel - Function to call when the Cancel button is clicked
 */
type AddressDialogProps = {
  open: boolean;
  initialValue?: Address;
  onData: (data: Address) => void;
  onCancel: () => void;
};

/**
 * The initial value of the Address object
 * @type {Address}
 */
const initialValue: Address = {
  bno: '',
  st: '',
  line1: '',
  line2: '',
  ldmk: '',
  city: '',
  state: '',
  country: '',
  pncd: 0,
};

// Yup validation schema for Address form
const schema = object({
  bno: string().required('Name is required'),
  st: string().required('Street is required'),
  line1: string().optional(),
  line2: string().optional(),
  ldmk: string().optional(),
  city: string().required('City is required'),
  state: string().required('State is required'),
  country: string().required('Country is required'),
  pncd: number()
    .typeError('Pincode should be a number')
    .required('Pincode is required')
    .min(600000, 'Enter a valid pincode')
    .max(700000, 'Enter a valid pincode'),
});

/**
 * React component that renders a dialog for entering an address.
 * @param {AddressDialogProps} props - The props passed to the component
 * @returns {JSX.Element} - The rendered component
 */
const AddressDialog = (props: AddressDialogProps): JSX.Element => {
  /**
   * Controlled values and field errors validated with yup validation schema.
   * @type {Object}
   * @property {Address} value - The current value of the Address object
   * @property {Object} inputErr - The current validation errors for each input field
   */
  const [values, fieldErrors, handleValue, handleReset, formError] =
    useValidate(initialValue, schema);

  useEffect(() => {
    if (props.initialValue) {
      handleReset({...props.initialValue});
    } else {
      handleReset(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValue]);

  const handleData = () => {
    props.onData(values as Address);
    handleReset();
  };

  // Field properties for the Address form.
  const fields: {[k: string]: FieldProps} = {
    bno: {
      name: 'bno',
      label: 'Building No',
      placeholder: '101/2',
      required: true,
    },
    st: {
      name: 'st',
      label: 'Street',
      placeholder: 'west street',
      required: true,
    },
    line1: {
      name: 'line1',
      label: 'Address Line 1',
      placeholder: 'Address Line 1',
    },
    line2: {
      name: 'line2',
      label: 'Address Line 2',
      placeholder: 'Address Line 2',
    },
    ldmk: {
      name: 'ldmk',
      label: 'Landmark',
      placeholder: 'Near Railway Station',
    },
    city: {
      name: 'city',
      label: 'City',
      placeholder: 'Chennai',
      required: true,
    },
    state: {
      name: 'state',
      label: 'State',
      placeholder: 'Tamil Nadu',
      required: true,
    },
    country: {
      name: 'country',
      label: 'Country',
      placeholder: 'India',
      required: true,
    },
    pncd: {
      name: 'pncd',
      label: 'Pincode',
      placeholder: 'Enter your pincode',
      required: true,
    },
  };

  // Controlled values and field errors validated with yup validation schema.
  const data = {
    value: values,
    inputErr: fieldErrors,
  };

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <DialogTitle>Add Address</DialogTitle>
      <DialogContent>
        <Typography>Fill the below details</Typography>
        <Stack component="form" gap={2} py={4}>
          <FormInput
            {...data}
            {...fields.bno}
            onChange={(e) => handleValue(e.target)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
          />
          <FormInput
            {...data}
            {...fields.st}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.line1}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.line2}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.ldmk}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.city}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.state}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.country}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.pncd}
            onChange={(e) => handleValue(e.target)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => props.onCancel()}>
          Cancel
        </Button>
        <Button disabled={!formError.completed} onClick={handleData}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressDialog;
