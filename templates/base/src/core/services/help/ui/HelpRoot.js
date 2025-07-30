import { jsx as _jsx } from "react/jsx-runtime";
import HelpContent from '@/core/services/help/ui/HelpContent';
const HelpRoot = ({ mode, onClose, help }) => {
    return (_jsx(HelpContent, { help: help, mode: mode, onClose: onClose }));
};
export default HelpRoot;
