import {useEffect, useRef, useState} from "react";

export function useVisibility<T extends HTMLElement>(
    options?: IntersectionObserverInit
) {
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, options);

        observer.observe(element);

        return () => observer.disconnect();
    }, [options]);

    return { ref, isVisible };
}