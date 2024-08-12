// 获取常用时间
import dayjs from 'dayjs';

export const LAST_7_DAYS: string[] = [
    dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
];

export const LAST_30_DAYS: string[] = [
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
];

/**
 * 格式化时间
 * @param date 时间
 * @param format  格式
 * @returns 字符串
 */
export const formatDate = (date: Date, format: string): string => {
    return date ? dayjs(date).format(format) : '';
};
