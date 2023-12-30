import React, { useState, useEffect, useRef } from 'react';
const Affix = (props) => {
    var _a;
    const { enabled = true, relativeElementSelector = '', fixedNavbarSelector = '', fixedFooterSelector = '', topOffset = 15, bottomOffset = 15, inheritParentWidth = true, children } = props;
    const [affixStyle, setAffixStyle] = useState({});
    const rootRef = useRef(null);
    const affixRef = useRef(null);
    const prevWindowScrollYRef = useRef((_a = window === null || window === void 0 ? void 0 : window.scrollY) !== null && _a !== void 0 ? _a : 0);
    const rootElement = rootRef.current;
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
        if (typeof window === 'undefined')
            return _style;
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
        if (typeof window === 'undefined')
            return;
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
    useEffect(() => {
        if (rootElement && ResizeObserver && inheritParentWidth) {
            let width = null;
            const observer = new ResizeObserver(() => {
                if (width !== null && width !== rootElement.clientWidth) {
                    setAffixStyle(computeStyle());
                    prevWindowScrollYRef.current = window.scrollY;
                }
                width = rootElement.clientWidth;
            });
            observer.observe(rootElement);
            return () => observer.disconnect();
        }
        return () => { };
    }, [rootElement]);
    return (React.createElement("div", { ref: rootRef, style: { width: '100%' } },
        React.createElement("div", { ref: affixRef, style: affixStyle }, children)));
};
export default Affix;
