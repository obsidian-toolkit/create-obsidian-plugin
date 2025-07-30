import { t } from '@/lang';
import {
    CollapsibleSection,
    Overlay,
    Section,
    SectionHeader,
    SidebarButton,
    SidebarContainer,
    SidebarContent,
} from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/Sidebar.styled';
import { SidebarSections } from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/types/constants';

import { FC, useEffect, useState } from 'react';

import { ChevronDown, ChevronRight, MenuIcon } from 'lucide-react';
import { useLocation } from 'wouter';

const Sidebar: FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<
        Record<SidebarSections, boolean>
    >({
    });

    const toggleSection = (section: SidebarSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const [location, setLocation] = useLocation();
    const navigate = (path: string) => setLocation(path);

    useEffect(() => {
        const izdSettings = document.querySelector('.izd-settings');
        if (izdSettings) {
            izdSettings.classList.toggle('sidebar-open', isSidebarOpen);
        }
    }, [isSidebarOpen]);

    return (
        <>
            <SidebarButton
                aria-label={t.settings.toolbar.sidebar.tooltip}
                onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
                <MenuIcon size={18} />
            </SidebarButton>

            {isSidebarOpen && (
                <>
                    <Overlay onClick={() => setIsSidebarOpen(false)} />

                    <SidebarContainer>
                        <SidebarContent>
                        </SidebarContent>
                    </SidebarContainer>
                </>
            )}
        </>
    );
};

export default Sidebar;
