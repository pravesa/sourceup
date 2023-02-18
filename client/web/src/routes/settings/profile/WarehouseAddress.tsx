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
  deleteWarehouseAddress,
  getProfile,
  setWarehouseAddress,
} from '../slices/profileSlice';
import columns from './AddressColDef';
import {FormInput} from '../../../components';
import {useValidate} from '../../../lib';
import {FieldProps} from '../../../types';

/**
 * @typedef {Object} WarehouseAddressProps
 * @param {boolean} props.isFieldError - A boolean indicating whether there is an error with the form field for this address.
 */
interface WarehouseAddressProps {
  isFieldError: boolean;
}

const schema = object({
  id: string().required('ID is required'),
});

/**
 * Renders a section with a user's warehouse address, allowing the user to edit, add or remove the address.
 * @param {WarehouseAddressProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const WarehouseAddress = (props: WarehouseAddressProps): JSX.Element => {
  const {warehouse} = useAppSelector(getProfile);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, fieldErrors, handleValue, handleReset, formError] =
    useValidate({id: ''}, schema);

  const [openID, setOpenID] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<GridSelectionModel>([]);

  // Opens the ID dialog for getting warehouse id.
  const handleOpenID = () => {
    setOpenID(true);
  };

  // Closes the ID dialog when cancel button is clicked.
  const handleCloseID = () => {
    setOpenID(false);
  };

  // Opens the Address dialog after getting warehouse id. This will
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

  // Closes the Address dialog and Dispatches the address object to warehouse address reducer
  // with respective ID when the save button is clicked. It also resets local state.
  const handleData = (address: Address) => {
    handleClose();
    dispatch(
      setWarehouseAddress({id: selected[0] ?? (values.id as string), address})
    );
    handleReset();
  };

  // Deletes the selected warehouse address
  const handleDelete = () => {
    dispatch(deleteWarehouseAddress(selected[0]));
  };

  const fields: {[k: string]: FieldProps} = {
    id: {
      name: 'id',
      label: 'Warehouse ID',
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
        <DialogTitle>Set Warehouse ID</DialogTitle>
        <DialogContent>
          <Typography>Type unique ID for the warehouse address</Typography>
          <Stack gap={2} py={4}>
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
        initialValue={selected[0] ? warehouse[selected[0]] : undefined}
        onCancel={handleClose}
        onData={handleData}
      />
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h6">
          Warehouse Address{' '}
          {props.isFieldError && (
            <Chip label="Required" color="error" size="small" />
          )}
        </Typography>
        <Tooltip title={!selected[0] ? 'Add' : 'Edit'}>
          <IconButton
            color="primary"
            sx={{ml: 'auto'}}
            onClick={!selected[0] ? handleOpenID : handleOpen}
            aria-label={(!selected[0] ? 'add' : 'edit') + ' warehouse address'}
          >
            {!selected[0] ? <AddOutlined /> : <EditOutlined />}
          </IconButton>
        </Tooltip>
        {selected[0] && (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleDelete}
              aria-label="delete warehouse address"
            >
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <DataGrid
        autoHeight
        rows={
          warehouse
            ? Object.entries(warehouse).map((val) => {
                return {id: val[0], ...val[1]};
              })
            : []
        }
        columns={[{field: 'id', headerName: 'ID', minWidth: 70}, ...columns]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        selectionModel={selected}
        onSelectionModelChange={(model) => handleSelection(model)}
      />
    </Stack>
  );
};

export default WarehouseAddress;
