import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

type AllowedAsValues =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'span'
  | 'li'
  | 'ul'
  | 'figure'
  | 'blockquote';

type ElementTypeMap = {
  div: HTMLDivElement;
  section: HTMLElement;
  article: HTMLElement;
  aside: HTMLElement;
  header: HTMLElement;
  footer: HTMLElement;
  main: HTMLElement;
  nav: HTMLElement;
  p: HTMLParagraphElement;
  h1: HTMLHeadingElement;
  h2: HTMLHeadingElement;
  h3: HTMLHeadingElement;
  h4: HTMLHeadingElement;
  h5: HTMLHeadingElement;
  h6: HTMLHeadingElement;
  span: HTMLSpanElement;
  li: HTMLLIElement;
  ul: HTMLUListElement;
  figure: HTMLElement;
  blockquote: HTMLQuoteElement;
};

interface AnimatedSectionProps<TTag extends AllowedAsValues = 'div'> {
  children: React.ReactNode;
  className?: string;
  animationClasses?: {
    initial?: string;
    visible?: string;
    transition?: string;
    delayClass?: string;
  };
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
  as?: TTag;
}

export const AnimatedSection = <TTag extends AllowedAsValues = 'div'>({
  children,
  className = "",
  animationClasses = {},
  triggerOnce = true,
  threshold = 0.1,
  rootMargin = '0px',
  as,
}: AnimatedSectionProps<TTag>) => {
  const Tag = as || 'div';

  const [ref, isVisible] = useScrollAnimation<ElementTypeMap[TTag]>({ triggerOnce, threshold, rootMargin });

  const {
    initial = 'opacity-0 translate-y-8',
    visible = 'opacity-100 translate-y-0',
    transition = 'transition-all duration-700 ease-out',
    delayClass = ''
  } = animationClasses;

  return (
    <Tag
      ref={ref as any}
      className={`${className} ${transition} ${delayClass} ${isVisible ? visible : initial}`}
    >
      {children}
    </Tag>
  );
};