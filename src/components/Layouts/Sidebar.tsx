import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import * as Icons from '../Icon/IconExports';
import menuData from '../../shared/mocked-json/menuData.json';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string | null) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value || '';
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const renderIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName];
        return IconComponent ? <IconComponent className="shrink-0" /> : null;
    };

    // Recursively render the menu
    const renderMenu = (menu: any) => {
        return menu.map((item: any) => (
            <li key={item.childId} className={`menu nav-item ${item.isTitle ? 'uppercase font-extrabold' : ''}`}>
                {item.isTitle ? (
                    <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                        {item.icon && renderIcon(item.icon)}
                        <span>{t(item.label)}</span>
                    </h2>
                ) : item.subItems && item.subItems.length > 0 ? (
                    <>
                        <button type="button" className={`nav-link group w-full ${currentMenu === item.label ? 'active' : ''}`} onClick={() => toggleMenu(item.label)}>
                            <div className="flex items-center">
                                {renderIcon(item.icon)}
                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690]">{t(item.label)}</span>
                            </div>
                            <div className={`${currentMenu !== item.label ? 'rtl:rotate-90 -rotate-90' : ''}`}>
                                <IconCaretDown />
                            </div>
                        </button>
                        <AnimateHeight duration={300} height={currentMenu === item.label ? 'auto' : 0}>
                            <ul className="sub-menu text-gray-500">
                                {item.subItems.map((sub: any) => (
                                    <li key={sub.link}>
                                        <NavLink to={sub.link}>{t(sub.label)}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </AnimateHeight>
                    </>
                ) : (
                    <NavLink to={item.link || '#'} className={`nav-link group w-full ${currentMenu === item.label ? 'active' : ''}`} onClick={() => toggleMenu(null)}>
                        <div className="flex items-center">
                            {renderIcon(item.icon)}
                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690]">{t(item.label)}</span>
                        </div>
                    </NavLink>
                )}
            </li>
        ));
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)]">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">{renderMenu(menuData)}</ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
