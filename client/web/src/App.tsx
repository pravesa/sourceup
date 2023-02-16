import {Route, Routes} from 'react-router-dom';
import AppLayout from './AppLayout';
import {AuthenticateUser, SigninPage, SignupPage} from './routes/account';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route
        path="/"
        element={
          <AuthenticateUser>
            <AppLayout />
          </AuthenticateUser>
        }
      ></Route>
    </Routes>
  );
}

export default App;
