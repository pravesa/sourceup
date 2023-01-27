import {Route, Routes} from 'react-router-dom';
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
            <h1>Hello World</h1>
          </AuthenticateUser>
        }
      ></Route>
    </Routes>
  );
}

export default App;
