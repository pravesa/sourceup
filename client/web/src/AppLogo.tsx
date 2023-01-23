import {SvgIcon, SvgIconProps} from '@mui/material';
import {ReactComponent as Logo} from './assets/logo.svg';

const AppLogo = (props: SvgIconProps): JSX.Element => {
  return <SvgIcon {...props} component={Logo} inheritViewBox></SvgIcon>;
};

export default AppLogo;
