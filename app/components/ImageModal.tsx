'use client'

import Image from "next/image";
import Modal from "./Modal";


type Props = {
    src?: string | null,
    isOpen?: boolean,
    onClose: () => void
}

function ImageModal({ src, isOpen, onClose }: Props) {
    if (!src) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="w-80 h-80">
                <Image
                    alt="Image"
                    src={src}
                    className="object-cover"
                    fill
                />
            </div>
        </Modal>
    )
}

export default ImageModal;