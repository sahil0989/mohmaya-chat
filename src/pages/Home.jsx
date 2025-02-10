import React, { useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import Sidebar from '../components/Sidebar'
import MessagePage from '../components/MessagePage'
import AuthContext from '../context/AuthContext'

function Home() {

    const { currentUser, setOnlineUsers, setSocketcnt, fetchSideUser, setFetchUser, fetchAllUsers } = useContext(AuthContext);

    useEffect(() => {

        // console.log("Current User: ", currentUser);
        setFetchUser(true);

        const socketConnection = io(`${process.env.REACT_APP_BACKEND_URL}`, {
            auth: {
                userId: currentUser?._id
            }
        })

        setSocketcnt(socketConnection);
        
        console.log("Side bar ", currentUser?._id)

        socketConnection.emit('sidebar', currentUser?._id)

        socketConnection.on("onlineusers", async(data) => {
            setOnlineUsers(data);
            await fetchAllUsers();
            console.log("Online Users: ", data);
        })

        return () => {
            socketConnection.disconnect();
        }
        // eslint-disable-next-line
    }, [currentUser])

    return (
        <div>
            <div className='grid lg:grid-cols-[400px,1fr] h-screen max-h-screen'>

                {/* sidebar  */}
                <div className='w-full md:w-[400px]'>
                    <Sidebar fetchSideUser={fetchSideUser}/>
                </div>

                {/* Message Section  */}
                <div className='bg-[#e7e7e7] w-full'>
                    <MessagePage />
                </div>
            </div>
        </div>
    )
}

export default Home