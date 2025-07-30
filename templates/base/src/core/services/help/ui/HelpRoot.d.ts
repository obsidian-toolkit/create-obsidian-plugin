import Help from '@/core/services/help/help';
import { FC } from 'react';
export interface HelpRootProps {
    help: Help;
    mode: 'minimal' | 'full';
    onClose: () => void;
}
declare const HelpRoot: FC<HelpRootProps>;
export default HelpRoot;
