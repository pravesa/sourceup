import {AddOutlined, EditOutlined} from '@mui/icons-material';
import {
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';
import {Stack} from '@mui/system';
import {DataGrid, GridSelectionModel} from '@mui/x-data-grid';
import {useState} from 'react';
import {useAppSelector, useAppDispatch} from '../../../redux-hooks';
import AddressDialog from './AddressDialog';
import {
  getProfile,
  setHeadAddress,
  setIsHeadSameAsRegd,
} from '../slices/profileSlice';
import columns from './AddressColDef';

/**
 * @typedef {Object} HeadOfficeAddressProps
 * @param {boolean} props.isFieldError - A boolean indicating whether there is an error with the form field for this address.
 */
interface HeadOfficeAddressProps {
  isFieldError: boolean;
}

/**
 * Renders a section with a user's head office address, allowing the user to edit or add the address.
 * @param {HeadOfficeAddressProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const HeadOfficeAddress = (props: HeadOfficeAddressProps): JSX.Element => {
  const {isHeadSameAsRegd, head} = useAppSelector(getProfile);
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

  // Closes the dialog and Dispatches the address object to head office address reducer
  // when the save button is clicked.
  const handleData = (address: Address) => {
    handleClose();
    dispatch(setHeadAddress(address));
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

  const handleChange = () => {
    dispatch(setIsHeadSameAsRegd(!isHeadSameAsRegd));
  };

  return (
    <Stack gap={1}>
      <AddressDialog
        open={open}
        initialValue={head}
        onCancel={handleClose}
        onData={handleData}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">
          Head Office{' '}
          {props.isFieldError && (
            <Chip label="Required" color="error" size="small" />
          )}
        </Typography>
        <Tooltip title={props.isFieldError ? 'Add' : 'Edit'}>
          <span>
            <IconButton
              color="primary"
              onClick={handleOpen}
              disabled={isHeadSameAsRegd}
              aria-label={
                (props.isFieldError ? 'add' : 'edit') + ' head office address'
              }
            >
              {props.isFieldError ? <AddOutlined /> : <EditOutlined />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Box>
        <FormControlLabel
          label="Same as Registered address"
          control={
            <Checkbox checked={isHeadSameAsRegd} onChange={handleChange} />
          }
        ></FormControlLabel>
      </Box>
      <DataGrid
        autoHeight
        rows={head ? [{id: 1, ...head}] : []}
        columns={columns}
        pageSize={1}
        rowsPerPageOptions={[1]}
        selectionModel={selected}
        onSelectionModelChange={(model) => handleSelection(model)}
      />
    </Stack>
  );
};

export default HeadOfficeAddress;
