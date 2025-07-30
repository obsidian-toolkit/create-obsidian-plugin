import {
    SRoutesContainer,
    SRoutesContent,
} from '@/settings/ui/settings-page/routes-content/RoutesContent.styled';

import { FC } from 'react';

import { Route, Switch, useLocation } from 'wouter';

import Toolbar from './toolbar/Toolbar';

const RoutesContent: FC = () => {
    const [location] = useLocation();

    return (
        <SRoutesContent>
            <Toolbar />
            <SRoutesContainer>
                <Switch location={location}>
                </Switch>
            </SRoutesContainer>
        </SRoutesContent>
    );
};

export default RoutesContent;
