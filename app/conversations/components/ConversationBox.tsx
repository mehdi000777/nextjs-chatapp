'use client'

import Avatar from '@/app/components/Avatar'
import useOtherUser from '@/app/hooks/useOtherUser'
import { fullConversationType } from '@/app/types'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import AvatarGroup from '@/app/components/AvatarGroup'

type Props = {
    data: fullConversationType,
    selected: boolean
}

export default function ConversationBox({ data, selected }: Props) {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [router, data.id])

    const lastMessege = useMemo(() => {
        const messeges = data.messeges || [];

        return messeges[messeges.length - 1];
    }, [data.messeges])

    const userEmail = useMemo(() => {
        return session?.data?.user?.email
    }, [session?.data?.user?.email])

    const hasSeen = useMemo(() => {
        if (!lastMessege) return false;

        const seenArry = lastMessege.seens || [];

        if (!userEmail) return false;

        return seenArry.filter(user => user.email === userEmail).length !== 0;
    }, [lastMessege, userEmail])

    const lastMessegeText = useMemo(() => {
        if (lastMessege?.image) {
            return 'Sent an image';
        }

        if (lastMessege?.body) {
            return lastMessege?.body;
        }

        return 'Started a converstion'
    }, [lastMessege])

    return (
        <div
            onClick={handleClick}
            className={clsx('w-full p-3 relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg cursor-pointer transition',
                selected ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            {
                data.group
                    ? <AvatarGroup users={data.users} />
                    : <Avatar user={otherUser} />
            }
            <div className='min-w-0 flex-1'>
                <div className='focus:outline-none'>
                    <div className='flex justify-between items-center mb-1'>
                        <p className='text-md font-medium text-gray-900'>
                            {data.name || otherUser.name}
                        </p>
                        {
                            lastMessege?.createdAt && (
                                <p className='text-xs text-gray-400 font-light'>
                                    {format(new Date(lastMessege.createdAt), 'p')}
                                </p>
                            )
                        }
                    </div>
                    <p className={clsx('truncate text-sm',
                        hasSeen ? 'text-gray-500' : 'text-black font-medium'
                    )}>
                        {lastMessegeText}
                    </p>
                </div>
            </div>
        </div>
    )
}