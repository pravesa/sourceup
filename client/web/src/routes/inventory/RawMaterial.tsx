import {AddOutlined, DeleteOutlined, EditOutlined} from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import {DataGrid, GridSelectionModel, GridColDef} from '@mui/x-data-grid';
import {useState} from 'react';
import {AlertDialog} from '../../components';
import {storage, useFetch} from '../../lib';
import {useAppDispatch, useAppSelector} from '../../redux-hooks';
import {ServerResponse, ResponseAlert} from '../../types';
import CreateRawMaterial from './raw_material/CreateRawMaterial';
import EditRawMaterial from './raw_material/EditRawMaterial';
import {
  createStock,
  editStock,
  deleteStock,
  getInventory,
} from './slices/inventorySlice';

const columns: GridColDef[] = [
  {field: 'gsm', headerName: 'GSM', minWidth: 100, flex: 1},
  {field: 'width', headerName: 'Width (in)', minWidth: 100, flex: 1},
  {field: 'length', headerName: 'Length (in)', minWidth: 100, flex: 1},
  {field: 'material', headerName: 'Material', minWidth: 100, flex: 1},
  {field: 'bf', headerName: 'BF', minWidth: 70, flex: 1},
  {field: 'color', headerName: 'Color', minWidth: 130, flex: 1},
  {field: 'type', headerName: 'Type', minWidth: 70, flex: 1},
  {field: 'loc', headerName: 'Location', minWidth: 100, flex: 1},
  {field: 'stock', headerName: 'Stock (Ton)', minWidth: 130, flex: 1},
  {
    field: 'limit',
    headerName: 'Stock Limit',
    renderCell(params) {
      return params.row.stock < params.row.minLimit ? (
        <Chip label="Low" color="error" size="small" />
      ) : params.row.stock > params.row.maxLimit ? (
        <Chip label="High" color="warning" size="small" />
      ) : (
        <Chip label="Medium" color="success" size="small" />
      );
    },
  },
];

const RawMaterial = () => {
  const {stocks} = useAppSelector(getInventory);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState<{
    openDialog: boolean;
    idx: number;
  }>({openDialog: false, idx: -1});
  const [openEdit, setOpenEdit] = useState(false);

  const [fetchData] = useFetch();

  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

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

  const handleAlertClose = () => {
    setAlert(undefined);
  };

  const handleSave = (payload: {
    id: string;
    op: 'create' | 'update' | 'delete';
    stock?: Material;
  }) => {
    fetchData({
      url: '/s/api/inventory/raw-material',
      method: 'POST',
      headers: {
        accepts: 'application/json',
        'content-type': 'application/json',
      },
      // Payload property of request's body holds the data that will be processed by server for user authentication.
      body: JSON.stringify({
        payload,
      }),
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        if (res.status === 200) {
          setAlert({...res, severity: 'success'});
          storage.set('inventory', {stocks});
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

  // Closes the dialog and Dispatches the address object to registered address reducer
  // when the save button is clicked.
  const handleData = (data: Material) => {
    handleClose();
    const index = stocks.findIndex((stock) => stock.id === data.id);
    if (index !== -1) {
      setToEdit({openDialog: true, idx: index});
    } else {
      dispatch(createStock(data));
      handleSave({id: data.id, op: 'create', stock: data});
    }
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

  const handleConfirmEditClose = () => {
    setToEdit({...toEdit, openDialog: false});
  };

  const handleEditOpen = () => {
    handleConfirmEditClose();
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEdit = () => {
    const index = stocks.findIndex((stock) => stock.id === selected[0]);
    setToEdit({...toEdit, idx: index});
    setOpenEdit(true);
  };

  const handleDelete = () => {
    dispatch(deleteStock({id: selected[0]}));
    handleSave({id: selected[0].toString(), op: 'delete'});
  };

  const handleEditData = (data: Material) => {
    handleEditClose();
    dispatch(editStock({...toEdit, material: data}));
    handleSave({id: selected[0].toString(), op: 'update', stock: data});
  };

  return (
    <Stack gap={3} py={3}>
      {alert && (
        <AlertDialog
          dialogProps={{open: true}}
          {...alert}
          onClose={handleAlertClose}
        />
      )}
      <CreateRawMaterial
        open={open}
        initialValue={undefined}
        onData={handleData}
        onCancel={handleClose}
      />
      <Dialog open={toEdit.openDialog}>
        <DialogTitle>Material already exist</DialogTitle>
        <DialogContent>
          <Typography>If you want to edit the stock, click yes.</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleConfirmEditClose}>
            No
          </Button>
          <Button onClick={handleEditOpen}>Yes</Button>
        </DialogActions>
      </Dialog>
      <EditRawMaterial
        open={openEdit}
        initialValue={stocks[toEdit.idx]}
        onData={handleEditData}
        onCancel={handleEditClose}
      />
      <Card>
        <CardContent sx={{pt: 1, '&:last-child': {pb: 1}}}>
          <Stack direction="row" gap={1} justifyContent="center">
            <ButtonGroup>
              <Button
                startIcon={<AddOutlined />}
                aria-label="create raw material"
                onClick={handleOpen}
              >
                Create
              </Button>
              <Button
                startIcon={<EditOutlined />}
                aria-label="edit raw material"
                disabled={!selected[0]}
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                color="error"
                startIcon={<DeleteOutlined />}
                aria-label="delete raw material"
                disabled={!selected[0]}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
      </Card>
      <DataGrid
        aria-label="Raw material"
        autoHeight
        rows={stocks}
        columns={columns}
        selectionModel={selected}
        onSelectionModelChange={(model) => handleSelection(model)}
      />
    </Stack>
  );
};

export default RawMaterial;
