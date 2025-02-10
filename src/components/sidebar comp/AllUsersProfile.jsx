import React from 'react'
import { Link } from 'react-router-dom'

export default function AllUsersProfile({ userData }) {
    return (
        <Link to={`/${userData?._id}`} className='flex items-center gap-4 px-8 my-3 py-2 cursor-pointer hover:bg-black/10'>
            <div className='w-12 cursor-pointer'>
                <img src={userData?.profilePic} className='w-12 h-12 rounded-full' alt='pic' />
            </div>

            <div className='w-44'>
                <h2 className='font-semibold line-clamp-1 mb-2'>{userData?.username}</h2>
                <p className=' line-clamp-1 -mt-1 text-sm'>{userData?.emailId}</p>
            </div>
        </Link>
    )
}
