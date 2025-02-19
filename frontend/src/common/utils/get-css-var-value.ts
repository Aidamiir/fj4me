export const getCssVarValue = (variable: string, fallback: string) => {
    if (typeof window === 'undefined') return fallback;
    const computed = getComputedStyle(document.documentElement).getPropertyValue(variable);
    return computed ? computed.trim() || fallback : fallback;
}