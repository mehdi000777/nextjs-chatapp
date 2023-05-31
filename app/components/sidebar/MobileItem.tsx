'use client'

import Link from 'next/link';
import { IconType } from 'react-icons';
import clsx from 'clsx';

type Props = {
    lable: string,
    href: string,
    active?: boolean,
    onClick?: () => void,
    icon: IconType
}

export default function MobileItem({ lable, href, active, onClick, icon: Icon }: Props) {
    const handleClick = () => {
        if (onClick) return onClick();
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={clsx("group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",
                active && 'text-black bg-gray-100'
            )}
        >
            <Icon className='w-6 h-6' />
        </Link>
    )
}