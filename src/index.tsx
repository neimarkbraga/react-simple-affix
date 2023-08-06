import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  CSSProperties
} from 'react';

export interface AffixProps {

  // enable/disable affix
  enabled?: boolean

  // element to follow/base floating points
  relativeElementSelector?: string

  // fixed navbar element
  fixedNavbarSelector?: string

  // fixed footer element
  fixedFooterSelector?: string

  // top offset
  topOffset?: number

  // bottom offset
  bottomOffset?: number

  // maintain width by inheriting parent width
  // when position is fixed
  inheritParentWidth?: boolean

  // content
  children?: ReactNode
}

const Affix = (props: AffixProps) => {
  const {
    enabled = true,
    relativeElementSelector = '',
    fixedNavbarSelector = '',
    fixedFooterSelector = '',
    topOffset = 15,
    bottomOffset = 15,
    inheritParentWidth = true,
    children
  } = props;

  const [affixStyle, setAffixStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const affixRef = useRef<HTMLDivElement>(null);
  const prevWindowScrollYRef = useRef<number>(window?.scrollY ?? 0);

  const queryElement = (selector: string): HTMLElement | null => {
    if (selector)
      return document.querySelector<HTMLElement>(selector);
    return null;
  };

  const isElementVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  };

  const computeStyle = (): CSSProperties => {
    const _style: CSSProperties = {};
    const relative = queryElement(relativeElementSelector) || rootRef.current?.parentElement;
    const navbar = queryElement(fixedNavbarSelector);
    const footer = queryElement(fixedFooterSelector);

    if (typeof window === 'undefined') return _style;
    if (!rootRef.current) return _style;
    if (!affixRef.current) return _style;
    if (!relative) return _style;
    if (!enabled) return _style;
    if (!isElementVisible(relative)) return _style;
    if (!isElementVisible(rootRef.current)) return _style;
    if (!isElementVisible(affixRef.current)) return _style;

    const relativeRect = relative.getBoundingClientRect();
    const rootRect = rootRef.current.getBoundingClientRect();
    const affixRect = affixRef.current.getBoundingClientRect();

    const scrollY = window.scrollY;
    const prevScrollY = prevWindowScrollYRef.current;

    const topSpace = topOffset + (navbar?.clientHeight || 0) + (navbar?.offsetTop || 0);
    const bottomSpace = bottomOffset + (footer?.clientHeight || 0);
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
      if((scrollY + topSpace + contentHeight) >= floatEndPoint)
        _style.top = `${bottomPosition}px`;

      // affix height is bigger than view
      if (affixHeight > window.innerHeight) {

        // reach end
        if((scrollY + affixRect.bottom) >= floatEndPoint)
          _style.top = `${bottomPosition}px`;

        // scrolling down
        else if(scrollingDown)
          _style.top = `${Math.max(affixRect.top - scrollDistance, window.innerHeight - contentHeight - bottomSpace)}px`;

        // scrolling up
        else if(scrollingUp)
          _style.top = `${Math.min(affixRect.top + scrollDistance, topSpace)}px`;
      }
    }

    return _style;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!enabled) return;

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

  return (
    <div ref={rootRef} style={{ width: '100%' }}>
      <div ref={affixRef} style={affixStyle}>
        {children}
      </div>
    </div>
  );
};

export default Affix;