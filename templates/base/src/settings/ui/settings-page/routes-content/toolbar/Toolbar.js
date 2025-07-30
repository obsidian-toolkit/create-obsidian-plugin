import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from '@/settings/ui/settings-page/routes-content/toolbar/toolbar-content/Sidebar';
import { ToolbarComponent } from './Toolbar.styled';
import ResetSettings from './toolbar-content/ResetSettings';
const Toolbar = () => {
    return (_jsxs(ToolbarComponent, { children: [_jsx(Sidebar, {}), _jsx(ResetSettings, {})] }));
};
export default Toolbar;
