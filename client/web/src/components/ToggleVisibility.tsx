import {InputAdornment, Button} from '@mui/material';

type ToggleVisibilityProps = {
  state: boolean;
  toggleState: () => void;
};

// Component for toggling visibility
const ToggleVisibility = (props: ToggleVisibilityProps) => {
  const handlevisibilityState = () => {
    props.toggleState();
  };

  return (
    <InputAdornment position="end">
      <Button color="inherit" onClick={handlevisibilityState}>
        {props.state ? 'show' : 'hide'}
      </Button>
    </InputAdornment>
  );
};

export default ToggleVisibility;
