import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {Stack} from '@mui/system';
import {number, object} from 'yup';
import {FormInput} from '../../components';
import {useValidate} from '../../lib';
import {useAppDispatch} from '../../redux-hooks';
import {updateQuotation} from './slices/quotationSlice';

type PriceDialogProps = {
  open: boolean;
  value: RequiredItem;
  companyName: string;
  onClose: () => void;
};

const schema = object({
  rate: number()
    .transform((val, originalVal) => (originalVal === '' ? undefined : val))
    .typeError('Rate must be a number')
    .required('Rate is Required')
    .min(0, "Rate can't be negative"),
});

const PriceDialog = (props: PriceDialogProps) => {
  const [values, fieldErrors, handleValue, handleReset, formError] =
    useValidate({rate: ''}, schema);

  const dispatch = useAppDispatch();

  const handleSave = () => {
    dispatch(
      updateQuotation({
        companyName: props.companyName,
        item: props.value.name,
        quote: {
          quotedAt: new Date().toISOString(),
          rate: schema.cast(values).rate,
        },
      })
    );
    handleReset();
    props.onClose();
  };

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <DialogTitle>Set Price</DialogTitle>
      <DialogContent>
        <Stack gap={3}>
          <Typography>Set the latest price for {props.value?.name}</Typography>
          <FormInput
            name="rate"
            label="Rate (Rs)"
            placeholder="Enter latest rate"
            inputMode="numeric"
            required
            value={values}
            inputErr={fieldErrors}
            onChange={(e) => handleValue(e.target)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button onClick={handleSave} disabled={!formError.completed}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceDialog;
