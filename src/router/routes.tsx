import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/authentication/LoginBoxed'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
    },

];

export { routes };
