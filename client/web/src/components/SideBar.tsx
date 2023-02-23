import {
  ContactsOutlined,
  DashboardOutlined,
  InventoryOutlined,
  ReceiptOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import {Drawer, List, ListItem, Toolbar} from '@mui/material';
import {useLocation} from 'react-router-dom';
import AppLogo from '../AppLogo';
import ButtonRouter from './ButtonRouter';
import SideBarLink, {SideBarLinkProps} from './SideBarLink';

const SideBarWidth = 240;

type SideBarProps = {
  open: boolean;
  onClose: () => void;
};

const NavLinks: SideBarLinkProps[] = [
  {menu: 'Dashboard', href: '/dashboard', menuIcon: <DashboardOutlined />},
  {
    menu: 'Inventory',
    href: '/inventory',
    menuIcon: <InventoryOutlined />,
  },
  {
    menu: 'Quotation',
    href: '/quotation',
    menuIcon: <ReceiptOutlined />,
  },
  {menu: 'Contacts', href: 'contacts', menuIcon: <ContactsOutlined />},
];

const SideBar = (props: SideBarProps) => {
  const location = useLocation();

  // const [activeLink, setActiveLink] = useState<string>("");

  //   const handleActiveLink = (e: EventTarget) => {
  //   const el = (e as HTMLElement).closest("a");

  //   if (el) {
  //     const href = el.getAttribute("href") ?? "";
  //     if (href !== activeLink) {
  //       setActiveLink(href);
  //     }
  //   }
  // };

  const handleClose = () => {
    props.onClose();
  };

  const SideBarLogo = (
    <Toolbar>
      <ButtonRouter
        to="/"
        onClick={handleClose}
        fullWidth
        disableRipple
        sx={{padding: '12px 0'}}
      >
        <AppLogo sx={{width: '100%'}} />
      </ButtonRouter>
    </Toolbar>
  );

  const SideBarContent = (
    <List component="div" sx={{width: '100%'}}>
      {NavLinks.map((link) => (
        <SideBarLink
          key={link.menu}
          menu={link.menu}
          href={link.href}
          menuIcon={link.menuIcon}
          active={location.pathname === link.href}
          onClose={handleClose}
        />
      ))}
    </List>
  );

  const Settings = (
    <ListItem
      component="div"
      sx={{marginTop: 'auto', marginBottom: 2}}
      disablePadding
    >
      <SideBarLink
        menu="Settings"
        href="/settings"
        menuIcon={<SettingsOutlined />}
        active={location.pathname === '/settings'}
        onClose={handleClose}
      />
    </ListItem>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: {md: 'block', xs: 'none'},
          width: SideBarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SideBarWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {SideBarLogo}
        {SideBarContent}
        {Settings}
      </Drawer>
      <Drawer
        variant="temporary"
        open={props.open}
        onClose={handleClose}
        sx={{
          display: {md: 'none', xs: 'block'},
          width: SideBarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SideBarWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {SideBarLogo}
        {SideBarContent}
        {Settings}
      </Drawer>
    </>
  );
};

export default SideBar;
