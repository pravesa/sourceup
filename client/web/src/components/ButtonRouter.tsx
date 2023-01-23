import {Button, ButtonTypeMap} from '@mui/material';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {Link} from 'react-router-dom';

// Overrides common props between button and anchor element with anchor props
type ButtonRouterProps = OverrideProps<ButtonTypeMap, 'a'> & {
  to: string;
  replace?: boolean;
  state?: unknown;
};

// Button with routing capability
const ButtonRouter = (props: ButtonRouterProps) => {
  return <Button component={Link} {...props}></Button>;
};

export default ButtonRouter;
