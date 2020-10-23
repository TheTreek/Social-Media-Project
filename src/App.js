import React from 'react';
import Header from './Components/Header/Header'
import routes from './routes';
import {Helmet} from 'react-helmet-async';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Litter</title>
      </Helmet>
      <Header/>
      {routes}
    </div>
  );
}

export default App;
