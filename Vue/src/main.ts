import { createApp } from 'vue';
import App from './App.vue';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import config from 'devextreme/core/config';
import { licenseKey } from './devextreme-license';

config({ licenseKey });

const app = createApp(App);

app.mount('#app');
