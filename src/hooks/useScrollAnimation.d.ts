declare function useScrollAnimation<T extends HTMLElement>(options: {
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
}): [React.RefCallback<T>, boolean];

export default useScrollAnimation;
