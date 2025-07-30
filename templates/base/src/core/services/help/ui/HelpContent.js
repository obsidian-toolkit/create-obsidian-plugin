import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { OModal } from '@obsidian-lib/native-react-components';
import styled from 'styled-components';
const IntegratedSection = styled.div `
    flex: 1;
    min-width: 0;
`;
const HelpContent = ({ onClose, mode: externalMode, help, }) => {
    const diagramSectionRef = useRef(null);
    const [mode, setMode] = useState(externalMode);
    return (_jsx(OModal, { onClose: onClose, title: 'Empty Help', height: '100%', width: '100%' }));
};
export default HelpContent;
