import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/authentication/LoginBoxed'));
const MenuMaster = lazy(() => import('../pages/masters/Menu'));
const Select2 = lazy(() => import('../pages/masters/Select2'));
const RoleMaster = lazy(() => import('../pages/masters/RoleMaster'));
const UserRole = lazy(() => import('../pages/user/UserRole'));
const UserList = lazy(() => import('../pages/user/UserList'));
const MenuRoleMapping = lazy(() => import('../pages/masters/MenuRoleMapping'));

const routes = [
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
        path: '/masters/menu-master',
        element: <MenuMaster />,
    },
    {
        path: '/select2',
        element: <Select2 />,
    },
    {
        path: '/masters/role-master',
        element: <RoleMaster />,
    },
    {
        path: '/masters/menu-role-mapping',
        element: <MenuRoleMapping />,
    },
    {
        path: '/user/user-role',
        element: <UserRole />,
    },
    {
        path: '/user/user-list',
        element: <UserList />,
    },
];

export { routes };
