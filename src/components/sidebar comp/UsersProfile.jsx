import React from 'react'
import { Link } from 'react-router-dom'

export default function UsersProfile({ userData }) {

    return (
        <Link to={`/${userData?.userDetails?._id}`} className='flex items-center gap-4 px-8 my-3 py-2 cursor-pointer hover:bg-black/10'>
            <div className='w-12 cursor-pointer'>
                <img src={userData?.userDetails?.profilePic} className='w-12 h-12 rounded-full' alt='pic' />
            </div>

            <div className='w-44'>
                <h2 className='font-semibold line-clamp-1 mb-1'>{userData?.userDetails?.username}</h2>
                <p className=' line-clamp-1 -mt-1 text-sm'>{userData?.lastMsg?.text}</p>
            </div>
            {
                userData?.senderId?._id !== userData?.receiverId?._id ? (
                    <>
                        {
                            userData?.unseenMsg === 0 ? (<></>) : (
                                <div className='flex items-center justify-center bg-green-500 rounded-full text-[#000000]'>
                                    <div className='text-sm bg-green px-1'>{userData?.unseenMsg}</div>
                                </div>
                            )
                        }
                    </>
                ) : (<></>)
            }
        </Link>
    )
}
