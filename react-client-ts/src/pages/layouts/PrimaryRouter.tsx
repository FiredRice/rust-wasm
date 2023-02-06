import { Suspense } from 'react';
import { Route } from 'react-router-dom';
import LodingCom from './LodingCom';
import { ChunkLazy } from 'src/utils';

const Home = ChunkLazy(() => import('../home'));

const PrimaryRoutes = () => {
    return (
        <Suspense fallback={<LodingCom />}>
            <Route path='/' exact component={Home} />
        </Suspense>
    );
};

export default PrimaryRoutes;
