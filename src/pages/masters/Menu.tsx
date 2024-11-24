import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import mockedMenu from './../../shared/mocked-json/mockedMenu.json';
import IconPlus from './../../components/Icon/IconPlus';
import IconX from './../../components/Icon/IconX';

const MenuMaster = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch]);

    const statusOptions = [
        { value: 'inactive', label: 'InActive' },
        { value: 'active', label: 'Active' },
    ];

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [loading, setLoading] = useState(false);
    const [addMenuModal, setAddMenuModal] = useState<any>(false);

    const fetchPagingMenuData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.finoracleassociates.in/api/Menu/pagingwithsearch', {
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
            setMenuData(response.data);
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

    const onAddMenuClick = () => {
        setAddMenuModal(true);
    };

    interface MenuFormValues {
        label: string;
        icon: string;
        link: string;
        parentId: number;
        childId: number;
        isTitle: boolean;
        isAccess: boolean;
        status: number;
        subItems: string[];
      }

    const initialValues: MenuFormValues = {
        label: '',
        icon: '',
        link: '',
        parentId: 0,
        childId: 0,
        isTitle: true,
        isAccess: true,
        status: 0,
        subItems: [''],
      };

    const validationSchema = Yup.object({
        // menuName: Yup.string().required('Menu Name is required'),
        // icon: Yup.string().required('Icon is required'),
        // link: Yup.string().required('Link is required'),
        // parentId: Yup.string().required('Parent Id is required'),
        // childId: Yup.object().required('Child Id is required'),
        // status: Yup.object().required('Status is required'),
        label: Yup.string().required('Label is required'),
        icon: Yup.string().required('Icon is required'),
        link: Yup.string().url('Invalid URL').required('Link is required'),
        parentId: Yup.number().required('Parent ID is required').min(0, 'Parent ID cannot be negative'),
        childId: Yup.number().required('Child ID is required').min(0, 'Child ID cannot be negative'),
        isTitle: Yup.boolean().required('IsTitle is required'),
        isAccess: Yup.boolean().required('IsAccess is required'),
        status: Yup.number().required('Status is required').min(0, 'Status must be at least 0'),
        subItems: Yup.array().of(Yup.string().required('SubItem cannot be empty')).min(1, 'At least one subItem is required'),
    });

    const handleSubmit = async (values: MenuFormValues, { setSubmitting, resetForm }: FormikHelpers<MenuFormValues>) => {
        try {
          const response = await axios.post('https://api.finoracleassociates.in/api/Menu', values);
          console.log('Response:', response.data);
          alert('Menu item added successfully!');
          resetForm(); // Reset form after successful submission
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to add menu item');
        } finally {
          setSubmitting(false);
        }
      };

    const options = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light">Menu List</h5>
                <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
                    <button type="button" className="btn btn-primary gap-2" onClick={() => onAddMenuClick()}>
                        <IconPlus />
                        Add Menu
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
                <Dialog as="div" open={addMenuModal} onClose={() => setAddMenuModal(false)} className="relative z-[51]">
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
                                        onClick={() => setAddMenuModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Add Menu</div>
                                    <div className="p-5 md:p-8">
                                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                            <Form>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="mb-5">
                                                        <label htmlFor="menuName">Menu Name</label>
                                                        <Field id="menuName" name="menuName" type="text" placeholder="Enter Menu Name" className="form-input" />
                                                        <ErrorMessage name="menuName" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="icon">Icon</label>
                                                        <Field id="icon" name="icon" type="text" placeholder="Enter Icon Name" className="form-input" />
                                                        <ErrorMessage name="icon" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="link">Link</label>
                                                        <Field id="link" name="link" type="text" placeholder="Enter Link" className="form-input" />
                                                        <ErrorMessage name="link" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="parentId">Parent Id</label>
                                                        <Field id="parentId" name="parentId" type="text" placeholder="Enter Parent Id" className="form-input" />
                                                        <ErrorMessage name="parentId" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5 custom-select">
                                                        <label htmlFor="childId">Child Id</label>
                                                        <Select placeholder="Select Child Id" options={menuData} />
                                                        <ErrorMessage name="childId" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="status">Status</label>
                                                        <Field name="status" as={Select} options={statusOptions} />
                                                        <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field
                                                                    type="checkbox"
                                                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                    id="isTitle"
                                                                    name="isTitle"
                                                                />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">Is Title</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-5">
                                                        <div className="flex items-center">
                                                            <label className="w-12 h-6 relative">
                                                                <Field
                                                                    type="checkbox"
                                                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                    id="isAccess"
                                                                    name="isAccess"
                                                                />
                                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                            <span className="ml-2 text-white-dark">Is Access</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddMenuModal(false)}>
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

export default MenuMaster;
