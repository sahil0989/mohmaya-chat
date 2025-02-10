import React, { useContext, useEffect, useState } from 'react'
import { AiFillMessage } from "react-icons/ai";
import { HiUserAdd } from "react-icons/hi";
import { TiHome } from "react-icons/ti";
import { BiLogOut } from "react-icons/bi";
import logo from "../assests/img/logo.png"
import SideIcon from './sidebar comp/SideIcon';
import UsersProfile from './sidebar comp/UsersProfile';
import { MdOutlineClearAll } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AllUsersProfile from './sidebar comp/AllUsersProfile';
import { SignOutButton } from '@clerk/clerk-react';

export default function Sidebar() {

    const { allUsers, socketcnt, currentUser, fetchSideUser } = useContext(AuthContext);

    const { id } = useParams();
    const [sideBar, setSideBar] = useState(false);
    const [addUser, setAddUser] = useState(false);
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");


    useEffect(() => {
        if (socketcnt && currentUser) {
            socketcnt.emit('sidebar', currentUser?._id)

            socketcnt.on('conversation', (data) => {
                // console.log("Conversation", data)

                const userConversation = data.map((user) => {
                    if (user?.senderId?._id === user?.receiverId?._id) {
                        return { ...user, userDetails: user?.senderId };
                    } else if (user?.senderId?._id === currentUser?._id) {
                        return { ...user, userDetails: user?.receiverId };
                    } else {
                        return { ...user, userDetails: user?.senderId };
                    }
                });

                const sortedUsers = [...userConversation].sort(
                    (a, b) => new Date(b?.lastMsg?.createdAt) - new Date(a?.lastMsg?.createdAt)
                );
                setUsers(sortedUsers);

                // console.log("User side bar data: ", userConversation);
            })
        }
    }, [fetchSideUser, socketcnt, currentUser])

    return (
        <div className={`${id ? "hidden md:block" : "block"} w-full h-screen bg-[#e7e7e7]`}>

            <div className='flex items-center py-1 px-5'>
                <img src={logo} className='w-8 h-8 backdrop-filter-none' alt='icon' />
                <div className='text-black/80 font-medium'>Mohmaya</div>
            </div>

            <div className='relative flex w-full h-[calc(100vh-40px)]'>

                {/* Functionality  */}

                <div className={`absolute flex flex-col items-end justify-between py-[40px] h-full bg-[#e7e7e7] ${sideBar ? '' : 'w-[40px]'}`}>
                    <div className='grid gap-3 w-full'>

                        <div onClick={() => setSideBar(!sideBar)} className='flex items-center w-full hover:bg-white pl-1 cursor-pointer pr-4'>
                            <SideIcon Icon={MdOutlineClearAll} size={28} />
                            {
                                sideBar && <h4 className='text-sm font-medium pl-2'>Side Manager</h4>
                            }
                        </div>

                        <Link to={"/"} onClick={() => setAddUser(false)} className='flex items-center w-full hover:bg-white pl-1 cursor-pointer pr-4'>
                            <SideIcon Icon={TiHome} size={28} />
                            {
                                sideBar && <h4 className='text-sm font-medium pl-2'>Home</h4>
                            }
                        </Link>

                        <div onClick={() => setAddUser(false)} className='flex items-center w-full hover:bg-white pl-1 cursor-pointer pr-4'>
                            <SideIcon Icon={AiFillMessage} size={28} />
                            {
                                sideBar && <h4 className='text-sm font-medium pl-2'>Message</h4>
                            }
                        </div>

                        <div onClick={() => setAddUser(!addUser)} className='flex items-center w-full hover:bg-white pl-1 cursor-pointer pr-4'>
                            <SideIcon Icon={HiUserAdd} size={32} />
                            {
                                sideBar && <h4 className='text-sm font-medium pl-2'>Add User</h4>
                            }
                        </div>
                    </div>

                    <div className='grid gap-3 w-full mb-3'>

                        <div className='flex items-center pl-3 py-2 hover:bg-white cursor-pointer'>
                            <img src={currentUser?.profilePic} className='w-8 h-8 rounded-full' alt='user' />
                            {
                                sideBar && <h4 className='text-sm font-medium pl-2'>Add User</h4>
                            }
                        </div>

                        <SignOutButton>
                            <div className='flex items-center w-full hover:bg-white pl-1 cursor-pointer pr-4'>
                                <SideIcon Icon={BiLogOut} size={28} />
                                {
                                    sideBar && <h4 className='text-sm font-medium pl-2'>LogOut</h4>
                                }
                            </div>
                        </SignOutButton>

                    </div>

                </div>

                {
                    addUser ? (
                        <div className='ml-12 w-full rounded-ss-lg bg-white border-r border-black/20'>
                            <div>
                                <h2 id='heading' className='w-full font-semibold rounded-ss-lg text-xl py-3 px-5'>Add User</h2>
                                <div className='mx-12'>
                                    <input
                                        type='text'
                                        className='my-3 focus:outline-none w-full border-b-2 border-black px-2 text-sm'
                                        placeholder='Search'
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                </div>
                            </div>
                            <hr />
                            <div className='scrollbar my-6 h-[calc(100vh-180px)] overflow-y-scroll'>
                                {
                                    allUsers?.length === 0 && <div className='px-10 text-black/60'>Add a user to start conversation.</div>
                                }
                                {
                                    allUsers && allUsers?.map((user) => {
                                        return <div key={user._id}> <AllUsersProfile userData={user} /> </div>
                                    })
                                }
                            </div>
                        </div>
                    ) : (

                        // user conversation 

                        <div className='ml-12 w-full rounded-ss-lg bg-white border-r border-black/20'>
                            <div>
                                <h2 id='heading' className='w-full font-semibold rounded-ss-lg text-xl py-3 px-5'>Messages</h2>
                                <div className='mx-12'>
                                    <input
                                        type='text'
                                        className='my-3 focus:outline-none w-full border-b-2 border-black px-2 text-sm'
                                        placeholder='Search'
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                </div>
                            </div>
                            <hr />
                            <div className='scrollbar my-6 h-[calc(100vh-180px)] overflow-y-scroll'>
                                {
                                    users.length === 0 && <div className='px-10 text-black/60'>Add a user to start conversation.</div>
                                }
                                {
                                    users && users.map((user) => {
                                        return <div key={user._id}> <UsersProfile userData={user} /> </div>
                                    })
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}
