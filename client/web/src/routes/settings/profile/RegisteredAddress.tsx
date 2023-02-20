import {AddOutlined, EditOutlined} from '@mui/icons-material';
import {Typography, Chip, IconButton, Tooltip} from '@mui/material';
import {Stack} from '@mui/system';
import {DataGrid, GridSelectionModel} from '@mui/x-data-grid';
import {useState} from 'react';
import {useAppSelector, useAppDispatch} from '../../../redux-hooks';
import AddressDialog from './AddressDialog';
import columns from './AddressColDef';
import {getUser, setRegdAddress} from '../../account/slices/userSlice';

/**
 * @typedef {Object} RegisteredAddressProps
 * @param {boolean} props.isFieldError - A boolean indicating whether there is an error with the form field for this address.
 */
interface RegisteredAddressProps {
  isFieldError: boolean;
}

/**
 * Renders a section with a user's registered address, allowing the user to edit or add the address.
 * @param {RegisteredAddressProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const RegisteredAddress = (props: RegisteredAddressProps): JSX.Element => {
  const {regd} = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<GridSelectionModel>([]);

  // Opens the address dialog.
  const handleOpen = () => {
    setOpen(true);
  };

  // Closes the address dialog. This method is passed to
  // onCancel prop to close the dialog when cancel is clicked.
  const handleClose = () => {
    setOpen(false);
  };

  // Closes the dialog and Dispatches the address object to registered address reducer
  // when the save button is clicked.
  const handleData = (address: Address) => {
    handleClose();
    dispatch(setRegdAddress(address));
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

  return (
    <Stack gap={3}>
      <AddressDialog
        open={open}
        initialValue={regd}
        onCancel={handleClose}
        onData={handleData}
      />
      <Stack direction="row" alignItems="center">
        <Typography variant="h6">
          Registered Address{' '}
          {props.isFieldError && (
            <Chip label="Required" color="error" size="small" />
          )}
        </Typography>
        <Tooltip title={props.isFieldError ? 'Add' : 'Edit'}>
          <IconButton
            color="primary"
            sx={{ml: 'auto'}}
            onClick={handleOpen}
            aria-label={
              (props.isFieldError ? 'add' : 'edit') + ' registered address'
            }
          >
            {props.isFieldError ? <AddOutlined /> : <EditOutlined />}
          </IconButton>
        </Tooltip>
      </Stack>
      <DataGrid
        aria-label="Registered address"
        autoHeight
        rows={regd ? [{id: 1, ...regd}] : []}
        columns={columns}
        pageSize={1}
        rowsPerPageOptions={[1]}
        selectionModel={selected}
        onSelectionModelChange={(model) => handleSelection(model)}
      />
    </Stack>
  );
};

export default RegisteredAddress;
