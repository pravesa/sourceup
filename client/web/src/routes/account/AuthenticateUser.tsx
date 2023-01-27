import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from './UserAccount';

// Render children component if user is signed in else redirect to sign in page.
const AuthenticateUser = (props: {children: JSX.Element}) => {
  const {user} = useAuth();
  const {pathname} = useLocation();

  if (user.isSignedIn && user._id) {
    return props.children;
  }
  return <Navigate to="/signin" state={{from: pathname}} replace={true} />;
};

export default AuthenticateUser;
