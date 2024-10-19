import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from './../../components/Icon/IconPlus';
import mockedMenu from './../../shared/mocked-json/mockedMenu.json';

const MenuMaster = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [loading, setLoading] = useState(false);

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
        </div>
    );
};

export default MenuMaster;
