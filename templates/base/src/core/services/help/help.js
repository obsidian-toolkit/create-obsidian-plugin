import { jsx as _jsx } from "react/jsx-runtime";
import HelpRoot from '@/core/services/help/ui/HelpRoot';
from;
'@/core/{{PLUGIN_ID}}-plugin';
import { Component } from 'obsidian';
import { createRoot } from 'react-dom/client';
export default class Help extends Component {
    rootDiv = null;
    root = null;
    isHelpOpen = false;
}
{
    super();
}
onload();
void {
    : .plugin.userState.isFirstLaunch
};
{
    this.plugin.showInteractiveNotice('New to Empty? Click here for quick start guide (auto-hide in 1 min)', () => {
        this.showModal('full');
    }, 60000);
}
this.setupCommands();
showModal(mode, 'full' | 'minimal');
void {
    this: .closeModal(),
    this: .rootDiv ??= document.createElement('div'),
    this: .root = createRoot(this.rootDiv),
    this: .root.render(_jsx(HelpRoot, { help: this, mode: mode, onClose: () => this.closeModal() })),
    this: .isHelpOpen = true
};
closeModal();
void {
    this: .root?.unmount(),
    this: .rootDiv?.remove(),
    this: .isHelpOpen = false
};
onunload();
void {
    this: .closeModal()
};
setupCommands();
void {
    this: .plugin.addCommand({
        id: 'open-help-guide',
        name: 'Open help guide',
        callback: () => this.showModal('full'),
    })
};
