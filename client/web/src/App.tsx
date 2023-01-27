import {Route, Routes} from 'react-router-dom';
import {AuthenticateUser, SigninPage} from './routes/account';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />}></Route>
      <Route
        path="/"
        element={
          <AuthenticateUser>
            <h1>Hello World</h1>
          </AuthenticateUser>
        }
      ></Route>
    </Routes>
  );
}

export default App;
