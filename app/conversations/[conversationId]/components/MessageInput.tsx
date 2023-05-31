'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface Props {
    placeholder?: string,
    id: string,
    register: UseFormRegister<FieldValues>,
    type?: string,
    required?: boolean,
    errors: FieldErrors
}

export default function MessageInput({ placeholder, id, register, type, required, errors }: Props) {
    return (
        <div className="relative w-full">
            <input
                type={type}
                id={id}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
            />
        </div>
    )
}
