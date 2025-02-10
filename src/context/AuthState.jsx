import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";

export default function AuthState(props) {

    const [allUsers, setAllUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [socketcnt, setSocketcnt] = useState(null);
    const [fetchSideUser, setFetchUser] = useState(false)

    const { user } = useClerk();

    useEffect(() => {
        const handleAllUser = async () => {
            try {
                await userData();
            } catch (err) {
                // console.log("Error Occur: ", err.message);
            }
        }

        if (user) {
            handleAllUser()
        }
        // eslint-disable-next-line
    }, [user])

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/allUsers`);

            setAllUsers(res.data);
        } catch (err) {
            throw new Error("All User Error");
        }
    }

    const addUserData = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/signup`, {
                name: user?.fullName,
                username: user?.username,
                emailId: user?.emailAddresses[0].emailAddress,
                profilePic: user?.imageUrl
            });
            setCurrentUser(res.data);
            await fetchAllUsers();

        } catch (err) {
            // console.error("Add User Data Error: ", err.message);
        }
    };

    const userData = async () => {
        try {
            const existingUserRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
                username: user?.username
            });

            if (existingUserRes.status !== 200) {
                throw new Error(`Failed to fetch existing user data: ${existingUserRes.statusText}`);
            }

            setCurrentUser(existingUserRes.data);
            await fetchAllUsers();

            // console.log("Login User: ", existingUserRes.data);
        } catch (err) {
            await addUserData();
        }
    }


    return (
        <AuthContext.Provider value={{ allUsers, currentUser, setCurrentUser, fetchAllUsers, onlineUsers, setOnlineUsers, socketcnt, setSocketcnt, fetchSideUser, setFetchUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}