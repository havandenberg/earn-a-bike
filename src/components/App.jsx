import React from 'react';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import {history, store} from 'utils/store';
import TitleBar from 'components/TitleBar.jsx';
import Header from 'components/Header.jsx';
import Profile from 'components/Profile/index.jsx';
import Registration from 'components/Registration/index.jsx';
import AddManager from 'components/AddManager.jsx';
import SignIn from 'components/SignIn.jsx';

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <TitleBar />
          <div className="app-content">
            <Header />
            <Switch>
              <Route exact={true} path="/" component={SignIn} />
              <Route exact={true} path="/profile/:userid" component={Profile} />
              <Route exact={true} path="/registration" component={Registration} />
              <Route exact={true} path="/registration/manager" component={AddManager} />
            </Switch>
          </div>
        </div>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
