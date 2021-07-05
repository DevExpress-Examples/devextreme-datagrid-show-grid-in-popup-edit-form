import { useState } from 'react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import './App.css';

import { HomeComponent } from './components/Home';


function App() {
  return (
    <div className="App">
      <HomeComponent />
    </div>
  );
}

export default App;
