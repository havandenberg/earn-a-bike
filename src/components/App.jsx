import React from 'react';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import {history, store} from 'utils/store';
import Header from 'components/Header.jsx';
import SignIn from 'components/SignIn.jsx';

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <Switch>
            <Route exact={true} path="/" component={SignIn} />
          </Switch>
        </div>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
