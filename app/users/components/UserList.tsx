'use client'

import { User } from '@prisma/client'
import UserBox from './UserBox'

type Props = {
    users: User[]
}

export default function UserList({ users }: Props) {
    return (
        <aside className='fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto broder-r broder-gray-200 block w-full left-0'>
            <div className='px-5'>
                <div className='flex-col'>
                    <div className='text-2xl font-bold text-neutral-800 py-4'>
                        People
                    </div>
                </div>
                {
                    users.map(user => (
                        <UserBox
                            key={user.id}
                            data={user}
                        />
                    ))
                }
            </div>
        </aside>
    )
}