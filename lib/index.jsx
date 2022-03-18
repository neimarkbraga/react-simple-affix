import React, { useState, useEffect, useRef } from 'react';
const Affix = (props) => {
    const { enabled = true, relativeElementSelector = '', fixedNavbarSelector = '', fixedFooterSelector = '', topOffset = 15, bottomOffset = 15, inheritParentWidth = true, children } = props;
    const [affixStyle, setAffixStyle] = useState({});
    const rootRef = useRef(null);
    const affixRef = useRef(null);
    const prevWindowScrollYRef = useRef(window.scrollY);
    const queryElement = (selector) => {
        if (selector)
            return document.querySelector(selector);
        return null;
    };
    const isElementVisible = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 || rect.height > 0;
    };
    const computeStyle = () => {
        var _a;
        const _style = {};
        const relative = queryElement(relativeElementSelector) || ((_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.parentElement);
        const navbar = queryElement(fixedNavbarSelector);
        const footer = queryElement(fixedFooterSelector);
        if (!rootRef.current)
            return _style;
        if (!affixRef.current)
            return _style;
        if (!relative)
            return _style;
        if (!enabled)
            return _style;
        if (!isElementVisible(relative))
            return _style;
        if (!isElementVisible(rootRef.current))
            return _style;
        if (!isElementVisible(affixRef.current))
            return _style;
        const relativeRect = relative.getBoundingClientRect();
        const rootRect = rootRef.current.getBoundingClientRect();
        const affixRect = affixRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const prevScrollY = prevWindowScrollYRef.current;
        const topSpace = topOffset + ((navbar === null || navbar === void 0 ? void 0 : navbar.clientHeight) || 0) + ((navbar === null || navbar === void 0 ? void 0 : navbar.offsetTop) || 0);
        const bottomSpace = bottomOffset + ((footer === null || footer === void 0 ? void 0 : footer.clientHeight) || 0);
        const contentHeight = affixRef.current.clientHeight;
        const affixHeight = topSpace + contentHeight + bottomSpace;
        const floatStartPoint = scrollY + rootRect.top;
        const floatEndPoint = scrollY + relativeRect.bottom;
        const floatSpace = floatEndPoint - floatStartPoint;
        const canFloat = floatSpace > affixHeight;
        const scrollingUp = prevScrollY > scrollY;
        const scrollingDown = prevScrollY < scrollY;
        const scrollDistance = Math.abs(scrollY - prevScrollY);
        const bottomPosition = Math.ceil(floatEndPoint - (scrollY + contentHeight));
        if ((scrollY + topSpace) > floatStartPoint && canFloat) {
            _style.position = 'fixed';
            _style.top = topSpace;
            // follow root width
            if (inheritParentWidth)
                _style.width = `${rootRef.current.clientWidth}px`;
            // reach end
            if ((scrollY + topSpace + contentHeight) >= floatEndPoint)
                _style.top = `${bottomPosition}px`;
            // affix height is bigger than view
            if (affixHeight > window.innerHeight) {
                // reach end
                if ((scrollY + affixRect.bottom) >= floatEndPoint)
                    _style.top = `${bottomPosition}px`;
                // scrolling down
                else if (scrollingDown)
                    _style.top = `${Math.max(affixRect.top - scrollDistance, window.innerHeight - contentHeight - bottomSpace)}px`;
                // scrolling up
                else if (scrollingUp)
                    _style.top = `${Math.min(affixRect.top + scrollDistance, topSpace)}px`;
            }
        }
        return _style;
    };
    useEffect(() => {
        if (!enabled)
            return;
        const scrollHandler = () => {
            setAffixStyle(computeStyle());
            prevWindowScrollYRef.current = window.scrollY;
        };
        setAffixStyle(computeStyle());
        window.addEventListener('scroll', scrollHandler);
        window.addEventListener('resize', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('resize', scrollHandler);
        };
    }, [
        enabled,
        relativeElementSelector,
        fixedNavbarSelector,
        fixedFooterSelector,
        topOffset,
        bottomOffset,
        inheritParentWidth
    ]);
    return (<div ref={rootRef} style={{ width: '100%' }}>
      <div ref={affixRef} style={affixStyle}>
        {children}
      </div>
    </div>);
};
export default Affix;
//# sourceMappingURL=index.jsx.map