import config from 'devextreme/core/config';
import { licenseKey } from './devextreme-license';

config({ licenseKey });

import { createApp } from 'vue';
import App from './App.vue';

import 'devextreme/dist/css/dx.material.blue.light.compact.css';

const app = createApp(App);

app.mount('#app');
