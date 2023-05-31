'use client'

import { IconType } from "react-icons";
import Link from "next/link";
import clsx from "clsx";

interface Props {
    href: string,
    lable: string,
    icon: IconType,
    active?: boolean,
    onClick?: () => void
}

export default function DesktopItem({ href, lable, icon: Icon, active, onClick }: Props) {
    const handleClick = () => {
        if (onClick) return onClick();
    }

    return (
        <li onClick={handleClick}>
            <Link href={href} className={clsx("group flex gap-x-3 rounded-md p-3 text-sm leading-3 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
                active && 'bg-gray-100 text-black'
            )}>
                <Icon className="h-6 w-6 shrink-0" />
                <span className="sr-only">{lable}</span>
            </Link>
        </li>
    )
}
