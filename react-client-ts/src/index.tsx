import RustWasm from './core';
import middlewares from './middlewares';
import App from './App';

const app = new RustWasm();

app.use(middlewares);

app.injectRouters(<App />);

app.start(document.getElementById('root'));
