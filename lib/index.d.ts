import { ReactNode } from 'react';
export interface AffixProps {
    enabled?: boolean;
    relativeElementSelector?: string;
    fixedNavbarSelector?: string;
    fixedFooterSelector?: string;
    topOffset?: number;
    bottomOffset?: number;
    inheritParentWidth?: boolean;
    children?: ReactNode;
}
declare const Affix: (props: AffixProps) => JSX.Element;
export default Affix;
