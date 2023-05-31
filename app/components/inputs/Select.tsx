'use client'

import React from 'react'
import ReactSelect from 'react-select'

type Props = {
    disabled?: boolean,
    label: string,
    options: Record<string, any>[],
    onChange: (value: Record<string, any>) => void,
    value?: Record<string, any>
}

export default function Select({ disabled, label, options, onChange, value }: Props) {
    return (
        <div className='z-[100]'>
            <label className='block text-sm font-medium leading-6 text-gray-600'>
                {label}
            </label>
            <div className='mt-2'>
                <ReactSelect
                    isDisabled={disabled}
                    value={value}
                    options={options}
                    onChange={onChange}
                    isMulti
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 999
                        })
                    }}
                    classNames={{
                        control: () => 'text-sm'
                    }}
                />
            </div>
        </div>
    )
}