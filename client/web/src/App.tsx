import {Route, Routes} from 'react-router-dom';
import AppLayout from './AppLayout';
import {AuthenticateUser, SigninPage, SignupPage} from './routes/account';
import {Inventory} from './routes/inventory';
import {Quotation} from './routes/quotation';
import {Settings} from './routes/settings';

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
      >
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="/inventory" element={<Inventory />}></Route>
        <Route path="/quotation" element={<Quotation />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
