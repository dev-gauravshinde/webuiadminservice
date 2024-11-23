import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/authentication/LoginBoxed'));
const MenuMaster = lazy(() => import('../pages/masters/Menu'));
const Select2 = lazy(() => import('../pages/masters/Select2'));
const RoleMaster = lazy(() => import('../pages/masters/RoleMaster'));
const UserRole = lazy(() => import('../pages/user/UserRole'));
const UserList = lazy(() => import('../pages/user/UserList'));

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
    {
        path: '/user-role',
        element: <UserRole />,
        layout: 'blank',
    },
    {
        path: '/user-list',
        element: <UserList />,
        layout: 'blank',
    },

];

export { routes };
