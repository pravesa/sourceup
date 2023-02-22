import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import {forwardRef, useEffect} from 'react';
import {number, object, ref, string} from 'yup';
import {FormInput} from '../../../components';
import {useValidate} from '../../../lib';
import {FieldProps} from '../../../types';

type EditRawMaterialProps = {
  open: boolean;
  initialValue?: Material;
  onData: (data: Material) => void;
  onCancel: () => void;
};

const initialValue = {
  loc: '',
  minLimit: '',
  maxLimit: '',
  stock: '',
};

const schema = object({
  loc: string().notRequired(),
  minLimit: number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .typeError('Limit must be a number')
    .required('Limit is Required'),
  maxLimit: number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('minLimit', {
      is: (val: number) => val > 0,
      then: (schema) =>
        schema
          .typeError('Limit must be a number')
          .required('Limit is Required')
          .min(
            ref('minLimit'),
            "Maximum Limit can't be less than Minimum Limit"
          ),
    }),
  stock: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('Quantity must be a number')
    .required('Quantity is Required'),
});

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const limitUnitAdornment = <InputAdornment position="end">ton</InputAdornment>;

const EditRawMaterial = (props: EditRawMaterialProps) => {
  const [values, fieldErrors, handleValue, handleReset, formError] =
    useValidate(initialValue, schema);

  const fullScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (props.initialValue) {
      handleReset({...props.initialValue});
    } else {
      handleReset(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValue]);

  const handleData = () => {
    const data = {...(props.initialValue as Material), ...schema.cast(values)};
    props.onData(data as Material);
    handleReset();
  };

  const fields: {[k: string]: FieldProps} = {
    loc: {
      name: 'loc',
      label: 'Stock Location',
      placeholder: 'Stock Location',
    },
    minLimit: {
      name: 'minLimit',
      label: 'Minimum Limit',
      placeholder: 'Set Minimum Stock Limit',
    },
    maxLimit: {
      name: 'maxLimit',
      label: 'Maximum Limit',
      placeholder: 'Set Maximum Stock Limit',
    },
    stock: {
      name: 'stock',
      label: 'Stock',
      placeholder: 'Enter current Stock',
      required: true,
    },
  };

  const data = {
    value: values,
    inputErr: fieldErrors,
  };

  return (
    <Dialog
      open={props.open}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      TransitionComponent={fullScreen ? Transition : undefined}
    >
      <DialogTitle>Create Raw Material</DialogTitle>
      <DialogContent>
        <Typography>Fill the below details</Typography>
        <Stack gap={2} py={4}>
          <FormInput
            {...data}
            {...fields.loc}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.minLimit}
            InputProps={{
              endAdornment: limitUnitAdornment,
            }}
            onChange={(e) => handleValue(e.target, undefined, ['maxLimit'])}
          />
          <FormInput
            {...data}
            {...fields.maxLimit}
            InputProps={{
              endAdornment: limitUnitAdornment,
            }}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.stock}
            InputProps={{
              endAdornment: limitUnitAdornment,
            }}
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

export default EditRawMaterial;
