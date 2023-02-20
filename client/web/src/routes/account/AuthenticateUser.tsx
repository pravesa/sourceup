import {Navigate, useLocation} from 'react-router-dom';
import {useAppSelector} from '../../redux-hooks';
import {getUser} from './slices/userSlice';

// Render children component if user is signed in else redirect to sign in page.
const AuthenticateUser = (props: {children: JSX.Element}) => {
  const {_id, gstn} = useAppSelector(getUser);
  const {pathname} = useLocation();

  if (_id !== '' && gstn !== '') {
    return props.children;
  }
  return <Navigate to="/signin" state={{from: pathname}} replace={true} />;
};

export default AuthenticateUser;
