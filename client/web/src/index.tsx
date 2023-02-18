import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {UserAccount} from './routes/account';
import store from './store';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <UserAccount>
          <App />
        </UserAccount>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

// To start measuring performance of the app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
reportWebVitals();
