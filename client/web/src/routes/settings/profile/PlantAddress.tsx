import {AddOutlined, DeleteOutlined, EditOutlined} from '@mui/icons-material';
import {
  Typography,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {Stack} from '@mui/system';
import {DataGrid, GridSelectionModel} from '@mui/x-data-grid';
import {useState} from 'react';
import {object, string} from 'yup';
import {useAppSelector, useAppDispatch} from '../../../redux-hooks';
import AddressDialog from './AddressDialog';
import {
  deletePlantAddress,
  getProfile,
  setPlantAddress,
} from '../slices/profileSlice';
import columns from './AddressColDef';
import {FormInput} from '../../../components';
import {useValidate} from '../../../lib';
import {FieldProps} from '../../../types';

/**
 * @typedef {Object} PlantAddressProps
 * @param {boolean} props.isFieldError - A boolean indicating whether there is an error with the form field for this address.
 */
interface PlantAddressProps {
  isFieldError: boolean;
}

const schema = object({
  id: string().required('ID is required'),
});

/**
 * Renders a section with a user's factory address, allowing the user to edit, add or remove the address.
 * @param {PlantAddressProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const PlantAddress = (props: PlantAddressProps): JSX.Element => {
  const {plant} = useAppSelector(getProfile);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, fieldErrors, handleValue, handleReset, formError] =
    useValidate({id: ''}, schema);

  const [openID, setOpenID] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<GridSelectionModel>([]);

  // Opens the ID dialog for getting plant id.
  const handleOpenID = () => {
    setOpenID(true);
  };

  // Closes the ID dialog when cancel button is clicked.
  const handleCloseID = () => {
    setOpenID(false);
  };

  // Opens the Address dialog after getting plant id. This will
  // closes the ID dialog before opening address dialog.
  const handleOpen = () => {
    handleCloseID();
    setOpen(true);
  };

  // Closes the Address dialog when cancel button is clicked.
  const handleClose = () => {
    setOpen(false);
  };

  // Sets the selected row for edit or remove operations or unsets if the same
  // row is clicked.
  const handleSelection = (model: GridSelectionModel) => {
    if (selected[0] === model[0]) {
      setSelected([]);
    } else {
      setSelected(model);
    }
  };

  // Closes the Address dialog and Dispatches the address object to plant address reducer
  // with respective ID when the save button is clicked. It also resets local state.
  const handleData = (address: Address) => {
    handleClose();
    dispatch(
      setPlantAddress({id: selected[0] ?? (values.id as string), address})
    );
    handleReset();
  };

  // Deletes the selected factory address
  const handleDelete = () => {
    dispatch(deletePlantAddress(selected[0]));
  };

  const fields: {[k: string]: FieldProps} = {
    id: {
      name: 'id',
      label: 'Factory ID',
      placeholder: 'Enter unique ID',
      required: true,
    },
  };

  // Controlled values and field errors validated with yup validation schema.
  const data = {
    value: values,
    inputErr: fieldErrors,
  };

  return (
    <Stack gap={3}>
      <Dialog open={openID} fullWidth maxWidth="sm">
        <DialogTitle>Set Factory ID</DialogTitle>
        <DialogContent>
          <Typography>Type unique ID for the factory address</Typography>
          <Stack
            component="form"
            gap={2}
            py={4}
            onSubmit={(event) => event.preventDefault()}
          >
            <FormInput
              {...data}
              {...fields.id}
              onChange={(e) => handleValue(e.target)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseID}>
            Cancel
          </Button>
          <Button disabled={!formError.completed} onClick={handleOpen}>
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <AddressDialog
        open={open}
        initialValue={selected[0] ? plant[selected[0]] : undefined}
        onCancel={handleClose}
        onData={handleData}
      />
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h6">
          Factory Address{' '}
          {props.isFieldError && (
            <Chip label="Required" color="error" size="small" />
          )}
        </Typography>
        <Tooltip title={!selected[0] ? 'Add' : 'Edit'}>
          <IconButton
            color="primary"
            sx={{ml: 'auto'}}
            onClick={!selected[0] ? handleOpenID : handleOpen}
            aria-label={(!selected[0] ? 'add' : 'edit') + ' plant address'}
          >
            {!selected[0] ? <AddOutlined /> : <EditOutlined />}
          </IconButton>
        </Tooltip>
        {selected[0] && (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleDelete}
              aria-label="delete plant address"
            >
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <DataGrid
        autoHeight
        rows={Object.entries(plant).map((val) => {
          return {id: val[0], ...val[1]};
        })}
        columns={[{field: 'id', headerName: 'ID', minWidth: 70}, ...columns]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        selectionModel={selected}
        onSelectionModelChange={(model) => handleSelection(model)}
      />
    </Stack>
  );
};

export default PlantAddress;
