import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { HomeComponent } from './components/Home';

function App(): JSX.Element {
  return (
    <div className="main">
      <HomeComponent></HomeComponent>
    </div>
  );
}

export default App;
