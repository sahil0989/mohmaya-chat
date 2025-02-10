import React from 'react'

export default function SideIcon({ Icon, size }) {
    return (
        <div className='py-2 px-2 text-black/80'>
            <Icon size={size} />
        </div>
    )
}
