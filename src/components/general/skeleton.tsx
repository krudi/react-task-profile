import React, { FC } from 'react';

import { cn } from '@/utils/cn';

export default function Skeleton({
    className,
}: {
    className?: string;
}): ReturnType<FC> {
    return <div className={cn('skeleton', className)} />;
}
