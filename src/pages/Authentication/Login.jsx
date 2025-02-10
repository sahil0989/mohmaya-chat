import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function Login({ login, setLogin }) {

    const { setCurrentUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async () => {

        try {
            const res = await axios.post(`http://localhost:5000/user/login`, {
                username: username,
                password: password
            })

            console.log("Response: ", res.data);
            setCurrentUser(res?.data);
            
            navigate('/');
        } catch (err) {
            console.log("Login Error: ", err.message);
        }

    };

    const handleNavigateToSignup = () => {
        setLogin(!login);
    };

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='w-[350px] md:w-[550px] rounded-lg shadow-sm bg-gradient-to-tr from-orange-500 to-orange-600'>
                <div className='p-8 flex flex-col gap-3'>
                    <h2 className='font-bold text-xl md:text-2xl w-full flex justify-center'>Mohmaya</h2>
                    <div className='flex flex-col w-full items-center'>
                        <div className='flex gap-5 items-end'>
                            <h4>Username</h4>
                            <input
                                type="text"
                                className='bg-transparent border-b-2 focus:outline-none px-3 py-1'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-5 items-end'>
                            <h4>Password</h4>
                            <input
                                type="password"
                                className='bg-transparent border-b-2 focus:outline-none px-3 py-1'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div onClick={handleSubmit} className='mt-6 text-white bg-black px-8 py-2 rounded-lg hover:bg-white hover:text-black cursor-pointer'>
                            Login
                        </div>
                        <div onClick={handleNavigateToSignup} className='mt-4 text-white underline cursor-pointer'>
                            Don't have an account? Sign up
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
