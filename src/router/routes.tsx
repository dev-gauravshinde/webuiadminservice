import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/authentication/LoginBoxed'));
const MenuMaster = lazy(() => import('../pages/masters/Menu'));
const Select2 = lazy(() => import('../pages/masters/Select2'));
const RoleMaster = lazy(() => import('../pages/masters/RoleMaster'));

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
    {
        path: '/select2',
        element: <Select2 />,
        layout: 'blank',
    },
    {
        path: '/role-master',
        element: <RoleMaster />,
        layout: 'blank',
    },

];

export { routes };
