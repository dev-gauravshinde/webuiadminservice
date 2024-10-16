import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/authentication/LoginBoxed'));
const MenuMaster = lazy(() => import('../pages/masters/Menu'));

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
    {
        path: '/menuMaster',
        element: <MenuMaster />,
        layout: 'blank',
    },

];

export { routes };
