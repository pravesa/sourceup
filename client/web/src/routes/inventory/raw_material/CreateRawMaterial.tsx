import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import {forwardRef, useEffect} from 'react';
import {number, object, ref, string} from 'yup';
import {RadioInput, FormInput} from '../../../components';
import {useValidate} from '../../../lib';
import {FieldProps} from '../../../types';

type CreateRawMaterialProps = {
  open: boolean;
  initialValue?: Material;
  onData: (data: Material) => void;
  onCancel: () => void;
};

const initialValue = {
  gsm: '',
  width: '',
  length: '',
  material: 'kraft',
  bf: '',
  color: 'brown',
  type: 'reel',
  loc: '',
  minLimit: '',
  maxLimit: '',
  stock: '',
};

const schema = object({
  gsm: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('GSM must be a number')
    .required('GSM is Required')
    .min(80, "GSM can't be less than 80")
    .max(600, "GSM can't be more than 600"),
  width: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('Width must be a number')
    .required('Width is Required')
    .min(8.0, "Width can't be less than 8.0 inch")
    .max(80.0, "Width can't be more than 80.0 inch"),
  length: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('Length must be a number')
    .when('type', {
      is: 'sheet',
      then: (schema) =>
        schema
          .required('Length is Required')
          .min(8.0, "Length can't be less than 8.0 inch")
          .max(80.0, "Length can't be more than 80.0 inch"),
      otherwise: (schema) =>
        schema
          .notRequired()
          .nullable(true)
          .transform((val, originalVal) => (originalVal === '' ? 0 : val)),
    }),
  material: string().oneOf(['kraft', 'duplex']),
  bf: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('BF must be a number')
    .required('BF is Required')
    .min(10, "BF can't be less than 10")
    .max(60, "BF can't be more than 60"),
  color: string().oneOf([
    'brown',
    'golden brown',
    'natural',
    'yellow',
    'golden yellow',
    'white',
    'white back',
    'silver',
  ]),
  type: string().oneOf(['reel', 'sheet']),
  loc: string().notRequired(),
  minLimit: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('Limit must be a number')
    .required('Limit is Required'),
  maxLimit: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
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

const CreateRawMaterial = (props: CreateRawMaterialProps) => {
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
    const data = schema.cast(values);
    const id = `${data.gsm}/${data.bf}/${data.width}/${data.length}`;
    props.onData({id: id, ...data} as Material);
    handleReset();
  };

  const fields: {[k: string]: FieldProps} = {
    gsm: {
      name: 'gsm',
      label: 'GSM',
      placeholder: '150',
      inputMode: 'numeric',
      required: true,
    },
    bf: {
      name: 'bf',
      label: 'Bursting Factor',
      placeholder: '18',
      inputMode: 'numeric',
      required: true,
    },
    material: {
      name: 'material',
      label: 'Material',
      options: [
        {value: 'kraft', label: 'Kraft'},
        {value: 'duplex', label: 'Duplex'},
      ],
      required: true,
    },
    color: {
      name: 'color',
      label: 'Color',
      placeholder: 'Golden Yellow',
      select: true,
      options: [
        {value: 'brown', label: 'Brown'},
        {value: 'natural', label: 'Natural'},
        {value: 'silver', label: 'Silver'},
        {value: 'yellow', label: 'Yellow'},
        {value: 'white', label: 'White'},
        {value: 'white back', label: 'White Back'},
        {value: 'golden brown', label: 'Golden Brown'},
        {value: 'golden yellow', label: 'Golden Yellow'},
      ],
      required: true,
    },
    type: {
      name: 'type',
      label: 'Type',
      options: [
        {value: 'reel', label: 'Reel'},
        {value: 'sheet', label: 'Sheet'},
      ],
      required: true,
    },
    width: {
      name: 'width',
      label: 'Width (inch)',
      placeholder: '44.5',
      inputMode: 'numeric',
      required: true,
    },
    length: {
      name: 'length',
      label: 'Length (inch)',
      placeholder: '44.5',
      inputMode: 'numeric',
    },
    loc: {
      name: 'loc',
      label: 'Stock Location',
      placeholder: 'Stock Location',
    },
    minLimit: {
      name: 'minLimit',
      label: 'Minimum Limit',
      placeholder: 'Set Minimum Stock Limit',
      required: true,
    },
    maxLimit: {
      name: 'maxLimit',
      label: 'Maximum Limit',
      placeholder: 'Set Maximum Stock Limit',
      required: true,
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
            {...fields.gsm}
            onChange={(e) => handleValue(e.target)}
          />
          <RadioInput
            {...data}
            {...fields.type}
            row={true}
            onChange={(e) => handleValue(e.target)}
          />
          <Stack direction="row" gap={2}>
            <FormInput
              {...data}
              {...fields.width}
              onChange={(e) => handleValue(e.target)}
            />
            {values.type !== 'reel' && (
              <FormInput
                {...data}
                {...fields.length}
                onChange={(e) => handleValue(e.target)}
              />
            )}
          </Stack>
          <FormInput
            {...data}
            {...fields.bf}
            onChange={(e) => handleValue(e.target)}
          />
          <RadioInput
            {...data}
            {...fields.material}
            row={true}
            onChange={(e) => handleValue(e.target)}
          />
          <FormInput
            {...data}
            {...fields.color}
            onChange={(e) => handleValue(e.target)}
          >
            {fields.color.options?.map((option) => (
              <MenuItem
                key={option.label}
                value={option.value /* value prop can't be unknown */}
              >
                {option.label}
              </MenuItem>
            ))}
          </FormInput>
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

export default CreateRawMaterial;
