import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import logo from "../assests/img/logo.png"
import { IoMdText } from "react-icons/io";
import AuthContext from '../context/AuthContext';
import { IoSend } from "react-icons/io5";
import moment from 'moment';
import { TiArrowLeftThick } from "react-icons/ti";

export default function MessagePage() {

    const { id } = useParams();
    const [text, setText] = useState("");
    const { onlineUsers, socketcnt, currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const [messages, setMessages] = useState([]);
    const currentMsg = useRef()

    useEffect(() => {
        if (currentMsg.current) {
            currentMsg.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages, id]);

    useEffect(() => {
        const fetchUserData = async () => {

            if (socketcnt) {
                socketcnt.emit('message-page', id);

                socketcnt.emit('seen', id)

                socketcnt.on('message-user', (data) => {
                    setUserData(data);
                })

                socketcnt.on('message', (data) => {
                    setMessages(data);
                })
            }
        }

        fetchUserData();
    }, [id, socketcnt])

    const handleMessage = async () => {

        if (text) {
            if (socketcnt) {
                socketcnt.emit("new message", {
                    sender: currentUser?._id,
                    receiver: id,
                    text: text
                })
            }
            setText("")
        }

    }

    return (
        <div className='w-full h-full'>
            <div className='pt-10 hidden md:block'></div>
            {
                id ? (
                    <div className='flex flex-col bg-[#e7e7e7] w-full h-screen py-5 md:py-0 md:h-[calc(100vh-40px)]'>

                        {/* user details  */}
                        <div className='flex items-center gap-6 w-full h-[70px] bg-white px-6 md:px-10'>
                            <Link to={"/"}>
                            <TiArrowLeftThick size={24} />
                            </Link>
                            <img src={userData?.profilePic} className='w-12 h-12 rounded-full' alt='user' />
                            <div>
                                <h2 className=' font-medium'>{userData?.name || "Unkown User"}</h2>
                                <p className='text-sm text-black/70'>
                                    {onlineUsers.find(user => user === id) ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>

                        {/* messages section  */}
                        <div className='w-full h-[calc(100vh)] md:h-[calc(100vh-180px)] my--4'>
                            {
                                messages?.length === 0 ? (
                                    <div className='flex justify-center items-center w-full h-full text-sm'>Start Your Conversation</div>
                                ) : (
                                    <div className='w-full h-[calc(100vh-180px)] overflow-y-scroll p-3'>
                                        {
                                            messages?.map((data, index) => {
                                                const isLastMessage = index === messages.length - 1;
                                                return (
                                                    <div
                                                        key={data?._id}
                                                        ref={isLastMessage ? currentMsg : null}
                                                        className={`flex mb-4 flex-col w-full ${currentUser?._id === data?.senderId ? "items-end" : "items-start"}`}
                                                    >
                                                        <div
                                                            className={`w-fit max-w-[50%] py-1 px-2 rounded-md ${currentUser?._id === data?.senderId ? "bg-green-500 justify-end" : "bg-white"}`}
                                                        >
                                                            {data.text}
                                                            <p className='text-[8px]'>{moment(data.createdAt).format('LT')}</p>
                                                        </div>
                                                        <p className='text-[11px]'>{moment(data.createdAt).format('LL')}</p>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                )
                            }
                        </div>

                        {/* type message section  */}
                        <div className='bg-white w-full h-[68px]'>
                            <div className='flex gap-5 h-full items-center px-10'>

                                <IoMdText size={32} />

                                <input type='text' value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { handleMessage(); } }} className='focus:outline-none w-full py-1 px-2' placeholder='Type a message' />

                                <IoSend size={28} onClick={handleMessage} className='cursor-pointer' />

                            </div>
                        </div>
                    </div>) : (
                    <div className='hidden md:flex flex-col gap-3 justify-center items-center bg-[#f8f8f8] w-full h-[calc(100vh-40px)]'>
                        <div className='flex items-center gap-2'>
                            <img src={logo} className='w-16 h-16' alt='' />
                            <h2 className='text-2xl font-semibold text-black/60'>Mohmaya</h2>
                        </div>
                        <p className='font-medium text-black/60'>Let's Start the conversation</p>
                    </div>
                )
            }
        </div>
    )
}
