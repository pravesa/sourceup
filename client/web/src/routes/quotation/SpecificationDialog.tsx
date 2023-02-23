import {CloseOutlined} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from '@mui/material';
import {Stack} from '@mui/system';

type SpecificationDialogProps = {
  open: boolean;
  value: RequiredItem;
  onClose: () => void;
};

const SpecificationDialog = (props: SpecificationDialogProps) => {
  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            {props.value?.name + "'s specification"}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => props.onClose()}
            aria-label="close"
          >
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {props.value?.spec && (
          <TableContainer>
            <Table>
              <TableBody>
                {Object.entries(props.value.spec).map(([key, val]) => {
                  return (
                    <TableRow key={key}>
                      <TableCell
                        sx={{fontWeight: 500, textTransform: 'uppercase'}}
                      >
                        {key}
                      </TableCell>
                      <TableCell>{val}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpecificationDialog;
