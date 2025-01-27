// @hook useHaptic - Haptic feedback utility for mobile interactions
import { useState, useCallback } from 'react';

/**
 * Hook for managing haptic feedback
 */
export function useHaptic() {
    const [isSupported] = useState(() => 'vibrate' in navigator);

    const light = useCallback(() => {
        if (isSupported) {
            navigator.vibrate(10);
        }
    }, [isSupported]);

    const medium = useCallback(() => {
        if (isSupported) {
            navigator.vibrate(25);
        }
    }, [isSupported]);

    const heavy = useCallback(() => {
        if (isSupported) {
            navigator.vibrate(50);
        }
    }, [isSupported]);

    const success = useCallback(() => {
        if (isSupported) {
            navigator.vibrate([10, 50, 10]);
        }
    }, [isSupported]);

    const error = useCallback(() => {
        if (isSupported) {
            navigator.vibrate([50, 100, 50, 100, 50]);
        }
    }, [isSupported]);

    return { light, medium, heavy, success, error, isSupported };
}

export default useHaptic;
