import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { t } from '@/lang';
import { Overlay, SidebarButton, SidebarContainer, SidebarContent, } from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/Sidebar.styled';
import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { useLocation } from 'wouter';
const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const [location, setLocation] = useLocation();
    const navigate = (path) => setLocation(path);
    useEffect(() => {
        const izdSettings = document.querySelector('.izd-settings');
        if (izdSettings) {
            izdSettings.classList.toggle('sidebar-open', isSidebarOpen);
        }
    }, [isSidebarOpen]);
    return (_jsxs(_Fragment, { children: [_jsx(SidebarButton, { "aria-label": t.settings.toolbar.sidebar.tooltip, onClick: () => setIsSidebarOpen((prev) => !prev), children: _jsx(MenuIcon, { size: 18 }) }), isSidebarOpen && (_jsxs(_Fragment, { children: [_jsx(Overlay, { onClick: () => setIsSidebarOpen(false) }), _jsx(SidebarContainer, { children: _jsx(SidebarContent, {}) })] }))] }));
};
export default Sidebar;
