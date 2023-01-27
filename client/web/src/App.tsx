import {Route, Routes} from 'react-router-dom';
import {SigninPage} from './routes/account';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />}></Route>
    </Routes>
  );
}

export default App;
