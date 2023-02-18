import {AddOutlined, EditOutlined} from '@mui/icons-material';
import {Typography, Chip, IconButton, Tooltip} from '@mui/material';
import {Stack} from '@mui/system';
import {DataGrid} from '@mui/x-data-grid';
import {useState} from 'react';
import {useAppSelector, useAppDispatch} from '../../../redux-hooks';
import AddressDialog from './AddressDialog';
import {getProfile, setRegdAddress} from '../slices/profileSlice';
import columns from './AddressColDef';

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
  const {regd} = useAppSelector(getProfile);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

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
            aria-label={props.isFieldError ? 'Add' : 'Edit'}
          >
            {props.isFieldError ? <AddOutlined /> : <EditOutlined />}
          </IconButton>
        </Tooltip>
      </Stack>
      <DataGrid
        autoHeight
        rows={regd ? [{id: 1, ...regd}] : []}
        columns={columns}
        pageSize={1}
        rowsPerPageOptions={[1]}
      />
    </Stack>
  );
};

export default RegisteredAddress;
