import {
  Alert,
  AlertColor,
  AlertProps,
  AlertTitle,
  Snackbar,
  SnackbarProps,
} from '@mui/material';

type AlertDialogProps = {
  severity: AlertColor;
  status?: number;
  statusText?: string;
  message: string;
  onClose?: () => void;
  dialogProps?: Omit<SnackbarProps, 'onClose'>;
  alertProps?: Omit<AlertProps, 'onClose'>;
};

/**
 * Custom Alert component extending MUI's Alert
 */
const AlertDialog = (props: AlertDialogProps) => {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <Snackbar
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      autoHideDuration={8000}
      onClose={handleClose}
      {...props.dialogProps}
    >
      <Alert
        severity={props.severity}
        onClose={handleClose}
        sx={{maxWidth: '100%'}}
        {...props.alertProps}
      >
        <AlertTitle aria-label="alert title">{props.statusText}</AlertTitle>
        <span aria-label="alert message">{props.message}</span>
      </Alert>
    </Snackbar>
  );
};

export default AlertDialog;
