import { BrowserRouter, MemoryRouter, Switch, Route } from 'react-router-dom';
import NotFound from './pages/404/NotFound';
import PrimaryRoutes from './pages/layouts/PrimaryRouter';
import './style/index.less';

const App = () => {
    return (
        <BrowserRouter>
            <MemoryRouter>
                <Switch>
                    <Route path='/404' exact component={NotFound} />
                    <Route path='/' component={PrimaryRoutes} />
                </Switch>
            </MemoryRouter>
        </BrowserRouter>
    );
};

export default App;