import Help from '@/core/services/help/help';
import { HelpRootProps } from '@/core/services/help/ui/HelpRoot';
import HelpSection from '@/core/services/help/ui/HelpSection';
import { BaseUnitContext } from '@/core/services/types/interfaces';

import { FC, useEffect, useRef, useState } from 'react';

import { OModal } from '@obsidian-lib/native-react-components';
import { Component, MarkdownRenderer } from 'obsidian';
import styled from 'styled-components';



const IntegratedSection = styled.div`
    flex: 1;
    min-width: 0;
`;

interface HelpContentProps extends HelpRootProps {}

const HelpContent: FC<HelpContentProps> = ({
    onClose,
    mode: externalMode,
    help,
}) => {
    const diagramSectionRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState(externalMode);


    return (
        <OModal
            onClose={onClose}
            title={'Empty Help'}
            height={'100%'}
            width={'100%'}
        >
        </OModal>
    );
};

export default HelpContent;
