import {CloseOutlined, RefreshOutlined} from '@mui/icons-material';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {forwardRef, useEffect, useState} from 'react';
import {AlertDialog} from '../../components';
import {storage} from '../../lib';
import {useAppDispatch, useAppSelector} from '../../redux-hooks';
import {ResponseAlert, ServerResponse} from '../../types';
import PriceDialog from './PriceDialog';
import {
  getQuotation,
  setQuotation,
  setRequirements,
} from './slices/quotationSlice';
import SpecificationDialog from './SpecificationDialog';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Quotation = () => {
  const {requirements, quotations} = useAppSelector(getQuotation);
  const dispatch = useAppDispatch();

  const [isPending, setIsPending] = useState(true);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number>(0);

  const [item, setItem] = useState<RequiredItem | undefined>(undefined);
  const [openSpec, setOpenSpec] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  const [alert, setAlert] = useState<ResponseAlert | undefined>(undefined);

  const getRequirements = async () => {
    const response1 = await fetch('/s/api/quotation/get-requirements', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    });
    const req = ((await response1.json()) as ServerResponse).payload;
    dispatch(setRequirements(req));
    storage.set('requirements', req ?? {});
  };

  useEffect(() => {
    const getData = async () => {
      await getRequirements();

      const response2 = await fetch('/s/api/quotation/get-quotations', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      });
      const quotes = ((await response2.json()) as ServerResponse).payload;
      dispatch(setQuotation(quotes));
      storage.set('quotations', quotes ?? {});
    };

    const req = storage.get('requirements');

    if (!req) {
      getData();
    } else {
      dispatch(setRequirements(req));
      dispatch(setQuotation(storage.get('quotations') ?? {}));
    }
    setIsPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
    {field: 'name', headerName: 'Name', minWidth: 100, flex: 1},
    {
      field: 'spec',
      headerName: 'Specifications',
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return (
          <Button
            onClick={() => {
              setItem(params.row);
              setOpenSpec(true);
            }}
          >
            view spec
          </Button>
        );
      },
    },
    {field: 'moq', headerName: 'MOQ (Nos)', minWidth: 130, flex: 1},
    {
      field: 'quoted',
      headerName: 'Quoted Price (Rs)',
      minWidth: 130,
      flex: 1,
      renderCell(params) {
        return (
          quotations[requirements[selected].companyName]?.[params.row.name]?.at(
            -1
          )?.rate ?? ''
        );
      },
    },
    {
      field: 'price',
      headerName: 'Price (Rs)',
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return (
          <Button
            onClick={() => {
              setItem(params.row);
              setOpenPrice(true);
            }}
          >
            Set Price
          </Button>
        );
      },
    },
  ];

  const handleOpen = (index: number) => {
    setSelected(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    fetch('/s/api/quotation/update-quotations', {
      method: 'POST',
      headers: {
        accepts: 'application/json',
        'content-type': 'application/json',
      },
      // Payload property of request's body holds the data that will be processed by server for user authentication.
      body: JSON.stringify({
        payload: {
          [requirements[selected].companyName]:
            quotations[requirements[selected].companyName],
        },
      }),
    })
      .then((response: Response) => response.json())
      .then((res: ServerResponse) => {
        if (res.status === 200) {
          setAlert({...res, severity: 'success'});
          storage.set('quotations', {quotations});
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

  const handleAlertClose = () => {
    setAlert(undefined);
  };

  return (
    <Stack px={{xs: 1.5, sm: 3}} flexGrow={1} gap={2}>
      {alert && (
        <AlertDialog
          dialogProps={{open: true}}
          {...alert}
          onClose={handleAlertClose}
        />
      )}
      <Dialog open={open} fullScreen fullWidth TransitionComponent={Transition}>
        <SpecificationDialog
          open={openSpec}
          value={item as RequiredItem}
          onClose={() => setOpenSpec(false)}
        />
        <PriceDialog
          open={openPrice}
          value={item as RequiredItem}
          companyName={requirements[selected]?.companyName}
          onClose={() => setOpenPrice(false)}
        />
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Typography variant="h6">
              {requirements[selected]?.companyName ?? ''} Requirements
            </Typography>
            <Button variant="outlined" sx={{ml: 'auto'}} onClick={handleSave}>
              Save
            </Button>
            <IconButton
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseOutlined />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DataGrid
            aria-label="Raw material"
            autoHeight
            rows={requirements[selected]?.items ?? []}
            columns={columns}
            disableSelectionOnClick
          />
        </DialogContent>
      </Dialog>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Requirements</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshOutlined />}
          onClick={() => getRequirements()}
        >
          Refresh
        </Button>
      </Stack>
      <Grid container columns={{xs: 2, sm: 3}} columnSpacing={2} rowSpacing={2}>
        {!isPending &&
          requirements.map((req, index) => {
            const completed = Object.keys(
              quotations[req.companyName] ?? {}
            ).length;

            return (
              <Grid item xs={1} key={req.companyName}>
                <Card>
                  <CardActionArea onClick={() => handleOpen(index)}>
                    <CardHeader title={req.companyName}></CardHeader>
                    <CardContent>
                      <Stack direction="row" flexWrap="wrap" gap={2}>
                        <Chip
                          color="primary"
                          label={`Completed (${completed})`}
                        ></Chip>
                        <Chip
                          color="warning"
                          label={`Pending (${req.items.length - completed})`}
                        ></Chip>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Stack>
  );
};

export default Quotation;
