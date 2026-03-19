import { useEffect, useRef, useState } from "react";

type UseInViewOnceOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  disabled?: boolean;
};

export const useInViewOnce = <T extends Element>({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  disabled = false,
}: UseInViewOnceOptions = {}) => {
  const ref = useRef<T | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    if (disabled || hasEnteredView) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [disabled, hasEnteredView, root, rootMargin, threshold]);

  return { ref, hasEnteredView };
};
