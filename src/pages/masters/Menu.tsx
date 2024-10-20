import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Select from 'react-select';
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
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [loading, setLoading] = useState(false);
    const [addMenuModal, setAddMenuModal] = useState<any>(false);

    const fetchMenuData = async () => {
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

    useEffect(() => {
        fetchMenuData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, search, sortStatus]);

    const onAddMenuClick = () => {
        console.log('add menu clicked');
        setAddMenuModal(true);
    };

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
                                        <form>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="mb-5">
                                                    <label htmlFor="menuName">Menu Name</label>
                                                    <input id="menuName" type="text" placeholder="Enter Menu Name" className="form-input" />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="icon">Icon</label>
                                                    <input id="icon" type="text" placeholder="Enter Icon Name" className="form-input" />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="link">Link</label>
                                                    <input id="link" type="text" placeholder="Enter Link" className="form-input" />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="parentId">Parent Id</label>
                                                    <input id="parentId" type="text" placeholder="Enter Parent Id" className="form-input" />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="status">Status</label>
                                                    <Select placeholder="Select an option" defaultValue={statusOptions[0]} options={statusOptions} isSearchable={false} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="status">Status</label>
                                                    <Select placeholder="Select an option" defaultValue={statusOptions[0]} options={statusOptions} isSearchable={false} />
                                                </div>
                                                <div className="mb-5">
                                                    <div className="flex items-center">
                                                        <label className="w-12 h-6 relative">
                                                            <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="isTitle" />
                                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                        </label>
                                                        <span className="ml-2 text-white-dark">Is Title</span>
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <div className="flex items-center">
                                                        <label className="w-12 h-6 relative">
                                                            <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="isAccess" />
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
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    Add
                                                </button>
                                            </div>
                                        </form>
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
