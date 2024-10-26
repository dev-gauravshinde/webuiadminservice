import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import mockedMenu from './../../shared/mocked-json/mockedMenu.json';
import IconPlus from './../../components/Icon/IconPlus';
import IconX from './../../components/Icon/IconX';

const RoleMaster: React.FC = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [roleData, setRoleData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [loading, setLoading] = useState(false);
    const [addMenuModal, setAddRoleModal] = useState<any>(false);

    const fetchPagingMenuData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.finoracleassociates.in/api/UserRole/pagingwithsearch', {
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
            const response = await axios.get('https://automechreports.in:8082/api/Menu');
            setRoleData(response.data);
        } catch (error) {
            console.error('Error fetching menu data from an API:', error);
        } finally {
            setLoading(false);
        }
    };

    // fetch data when component loads
    useEffect(() => {
        fetchPagingMenuData();
        fetchMenuData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, search, sortStatus]);

    const onAddRoleClick = () => {
        setAddRoleModal(true);
    };

    const initialValues = {
        roleName: '',
        description: '',
    };

    const validationSchema = Yup.object({
        roleName: Yup.string().required('Role Name is required'),
        description: Yup.string().required('Description is required'),
    });

    const onSubmit = (values: any) => {
        console.log('Form values:', values);
        setAddRoleModal(false);
    };

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light">Role List</h5>
                <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
                    <button type="button" className="btn btn-primary gap-2" onClick={() => onAddRoleClick()}>
                        <IconPlus />
                        Add Role
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
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Add Role</div>
                                    <div className="p-5 md:p-8">
                                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                            <Form>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="mb-5">
                                                        <label htmlFor="roleName">Role Name</label>
                                                        <Field id="roleName" name="roleName" type="text" placeholder="Enter Role Name" className="form-input" />
                                                        <ErrorMessage name="roleName" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="description">Description</label>
                                                        <Field id="description" name="description" type="text" placeholder="Enter Description" className="form-input" />
                                                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
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

export default RoleMaster;
