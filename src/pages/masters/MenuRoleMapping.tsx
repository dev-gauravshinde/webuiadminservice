import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import mockedMenu from './../../shared/mocked-json/mockedMenu.json';
import IconPlus from './../../components/Icon/IconPlus';
import IconX from './../../components/Icon/IconX';
import Select from 'react-select';
import { showToastNotification } from '../../shared/components/ToastNotification';

const MenuRoleMapping: React.FC = () => {
    const selectOptions = [
        {
            id: 49,
            label: 'Bill Not Created List',
            icon: 'icon',
            link: '/automech/companypendingreport',
            parentId: 1,
            childId: 41,
            isTitle: false,
            isAccess: true,
            createDate: null,
            updateDate: '2024-11-26T12:13:40.2554238',
            createdBy: null,
            status: 1,
            updatedBy: 1,
            createdByUser: null,
            updatedByUser: null,
        },
        {
            id: 48,
            label: 'Company Payment Report',
            icon: 'icon',
            link: '/automech/companypaymentreport',
            parentId: 1,
            childId: 41,
            isTitle: false,
            isAccess: true,
            createDate: '2024-11-23T21:05:54.8965405',
            updateDate: null,
            createdBy: 1,
            status: 1,
            updatedBy: null,
            createdByUser: null,
            updatedByUser: null,
        },
    ];

    const statusOptions = [
        { value: false, label: 'InActive' },
        { value: true, label: 'Active' },
    ];

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [userData, setUserData] = useState<any[]>([]);
    const [userRoleData, setUserRoleData] = useState<any[]>([]);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [loading, setLoading] = useState(false);
    const [addMenuModal, setAddRoleModal] = useState<any>(false);

    const fetchPagingData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.finoracleassociates.in/api/MenuRoleMapping/pagingwithsearch', {
                params: {
                    sort: sortStatus.columnAccessor,
                    desc: sortStatus.direction === 'desc',
                    param: search,
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                },
            });

            const { results, rowCount } = response.data;
            setRecordsData(results);
            setTotalRecords(rowCount);
        } catch (error) {
            console.error('Error fetching menu data:', error);
            // temp mocking
            const { results, rowCount } = mockedMenu;
            setRecordsData(results);
            setTotalRecords(rowCount);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.finoracleassociates.in/api/Menu');
            setMenuData(response.data);
        } catch (error) {
            console.error('Error fetching menu data from an API:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRoleData = async () => {
        try {
            const response = await axios.get('https://api.finoracleassociates.in/api/UserRole');
            setUserRoleData(response.data);
        } catch (error) {
            console.error('Error fetching user role data from an API:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://api.finoracleassociates.in/api/User');
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data from an API:', error);
        }
    };

    // fetch data when component loads
    useEffect(() => {
        fetchPagingData();
        fetchMenuData();
        fetchUserRoleData();
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, search, sortStatus]);

    const onAddRoleClick = () => {
        setAddRoleModal(true);
    };

    interface UserRoleMappingFormValues {
        menuId: number | null;
        roleId: number | null;
        read: boolean;
        delete: boolean;
        edit: boolean;
        view: boolean;
        approve: boolean;
        status: boolean | null;
        createDate: string;
        updateDate: string;
        createdBy: number;
        updatedBy: number;
    }

    const initialValues: UserRoleMappingFormValues = {
        menuId: null,
        roleId: null,
        read: false,
        delete: false,
        edit: false,
        view: false,
        approve: false,
        status: null as boolean | null,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        createdBy: 0,
        updatedBy: 0,
    };

    const validationSchema = Yup.object({
        menuId: Yup.number().nullable().required('Menu ID is required'),
        roleId: Yup.number().nullable().required('Role ID is required'),
        read: Yup.boolean().required('Read permission is required'),
        delete: Yup.boolean().required('Delete permission is required'),
        edit: Yup.boolean().required('Edit permission is required'),
        view: Yup.boolean().required('View permission is required'),
        approve: Yup.boolean().required('Approve permission is required'),
        status: Yup.boolean().nullable().required('Status is required'),
    });

    const handleSubmit = async (values: UserRoleMappingFormValues, { setSubmitting, resetForm }: FormikHelpers<UserRoleMappingFormValues>) => {
        try {
            const postData = {
                ...values,
                status: values.status === null ? null : values.status ? 1 : 0,
            };
            const response = await axios.post('https://api.finoracleassociates.in/api/MenuRoleMapping', postData);
            console.log('Response:', response.data);
            alert('User Role Mapping added successfully!');
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            showToastNotification('error', 'Something went wrong!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light">Menu Role Mapping</h5>
                <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
                    <button type="button" className="btn btn-primary gap-2" onClick={() => onAddRoleClick()}>
                        <IconPlus />
                        Add Menu Role
                    </button>
                </div>
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'label', title: 'Menu Name', sortable: true },
                            { accessor: 'link', title: 'Link', sortable: true },
                            { accessor: 'icon', title: 'Icon', sortable: true },
                            { accessor: 'parentId', title: 'Parent Id', sortable: true },
                            { accessor: 'childId', title: 'Child Id', sortable: true },
                            { accessor: 'isTitle', title: 'is Title', sortable: true },
                            { accessor: 'isAccess', title: 'is Access', sortable: true },
                            { accessor: 'status', title: 'Status', sortable: true },
                        ]}
                        totalRecords={totalRecords}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        fetching={loading}
                    />
                </div>
            </div>

            <Transition appear show={addMenuModal} as={Fragment}>
                <Dialog as="div" open={addMenuModal} onClose={() => setAddRoleModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddRoleModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Add Menu Role</div>
                                    <div className="p-5 md:p-8">
                                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                            <Form>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="mb-5 custom-select">
                                                        <label htmlFor="menuId">Menu Name</label>
                                                        <Field name="menuId">
                                                            {({ field, form }: any) => (
                                                                <Select
                                                                    placeholder="Select an option"
                                                                    options={selectOptions}
                                                                    value={selectOptions.find((option) => option.id === field.value) || null}
                                                                    onChange={(option) => form.setFieldValue(field.name, option ? option.id : '')}
                                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                                    isClearable
                                                                    menuPortalTarget={document.body}
                                                                    menuPosition="absolute"
                                                                    styles={{
                                                                        menuPortal: (base) => ({ ...base, zIndex: 1050 }),
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="menuId" component="div" className="text-red-500 text-sm" />
                                                    </div>

                                                    <div className="mb-5 custom-select">
                                                        <label htmlFor="roleId">User Role</label>
                                                        <Field name="roleId">
                                                            {({ field, form }: any) => (
                                                                <Select
                                                                    placeholder="Select an option"
                                                                    options={userRoleData.map((item) => ({
                                                                        value: item.id,
                                                                        label: item.roleName,
                                                                    }))}
                                                                    value={userRoleData
                                                                        .map((item) => ({
                                                                            value: item.id,
                                                                            label: item.roleName,
                                                                        }))
                                                                        .find((option) => option.value === field.value)}
                                                                    onChange={(option) => form.setFieldValue(field.name, option ? option.value : null)}
                                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                                    isClearable
                                                                    menuPortalTarget={document.body}
                                                                    menuPosition="absolute"
                                                                    styles={{
                                                                        menuPortal: (base) => ({ ...base, zIndex: 1050 }),
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="roleId" component="div" className="text-red-500 text-sm" />
                                                    </div>

                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="read" name="read" />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">Create</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="edit" name="edit" />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">Edit</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="view" name="view" />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">View</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="delete" name="delete" />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">Delete</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field
                                                                    type="checkbox"
                                                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                    id="approve"
                                                                    name="approve"
                                                                />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">Approve</span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-5 custom-select">
                                                        <label htmlFor="status">Status</label>
                                                        <Field name="status">
                                                            {({ field, form }: any) => (
                                                                <Select
                                                                    placeholder="Select an option"
                                                                    options={statusOptions}
                                                                    value={statusOptions.find((option) => option.value === field.value) || null}
                                                                    onChange={(option) => form.setFieldValue(field.name, option ? option.value : null)}
                                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                                    isClearable
                                                                />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddRoleModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        Add
                                                    </button>
                                                </div>
                                            </Form>
                                        </Formik>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default MenuRoleMapping;
