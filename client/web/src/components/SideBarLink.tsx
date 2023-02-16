import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {Link} from 'react-router-dom';

export type SideBarLinkProps = {
  menu: string;
  href: string;
  menuIcon?: JSX.Element | undefined;
  active?: boolean;
  onClose?: () => void;
};

const SideBarLink = (link: SideBarLinkProps): JSX.Element => {
  const theme = useTheme();

  const handleClose = () => {
    if (link.onClose) {
      link.onClose();
    }
  };

  return (
    <ListItemButton
      component={Link}
      to={link.href}
      selected={link.active}
      sx={{
        flexGrow: 1,
        '&.Mui-selected': {
          borderRight: `4px solid ${theme.palette.primary.main}`,
        },
      }}
      onClick={handleClose}
    >
      {link.menuIcon && <ListItemIcon>{link.menuIcon}</ListItemIcon>}
      <ListItemText>{link.menu}</ListItemText>
    </ListItemButton>
  );
};

export default SideBarLink;
