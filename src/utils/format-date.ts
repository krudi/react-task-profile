const DEFAULT_LOCALE = 'de-DE';

type FormatDateInput = string | number | Date | null | undefined;

const isValidDate = (value: Date) => !Number.isNaN(value.getTime());

export const formatDate = (
    value: FormatDateInput,
    options: Intl.DateTimeFormatOptions = {}
): string => {
    if (value == null) return '—';

    const date =
        typeof value === 'string' || typeof value === 'number'
            ? new Date(value)
            : value;

    if (!(date instanceof Date) || !isValidDate(date)) {
        return '—';
    }

    return date.toLocaleDateString(DEFAULT_LOCALE, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    });
};

export const isPastDate = (value: FormatDateInput): boolean => {
    if (value == null) return false;

    const date =
        typeof value === 'string' || typeof value === 'number'
            ? new Date(value)
            : value;

    if (!(date instanceof Date) || !isValidDate(date)) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date.getTime() < today.getTime();
};
