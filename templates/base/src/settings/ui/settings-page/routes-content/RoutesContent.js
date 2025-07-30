import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SRoutesContainer, SRoutesContent, } from '@/settings/ui/settings-page/routes-content/RoutesContent.styled';
import { Switch, useLocation } from 'wouter';
import Toolbar from './toolbar/Toolbar';
const RoutesContent = () => {
    const [location] = useLocation();
    return (_jsxs(SRoutesContent, { children: [_jsx(Toolbar, {}), _jsx(SRoutesContainer, { children: _jsx(Switch, { location: location }) })] }));
};
export default RoutesContent;
