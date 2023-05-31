'use client'

import { User } from "@prisma/client"
import Image from "next/image"
import useActiveList from "../hooks/useActiveList"

interface Props {
    user: User
}

export default function Avatar({ user }: Props) {
    const { members } = useActiveList();
    const isActive = members.indexOf(user?.email!) !== -1;

    return (
        <div className="relative">
            <div className="relative inline-block rounded-full overflow-hidden w-9 h-9 md:w-11 md:h-11">
                <Image
                    alt="Avatar"
                    src={user.image || "/images/placeholder.jpg"}
                    fill
                />
            </div>
            {
                isActive &&
                <span className="absolute bg-green-500 w-2 h-2 rounded-full top-0 right-0 md:h-3 md:w-3 ring-2 ring-white block" />
            }
        </div>
    )
}
