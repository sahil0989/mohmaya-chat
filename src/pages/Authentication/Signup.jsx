import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function Signup({ login, setLogin }) {

    const navigate = useNavigate();

    const {setCurrentUser} = useContext(AuthContext);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        console.log("Signup form submitted");
        if (username && email && password) {
            
            try{
                const res = await axios.put(``, {
                    username, email, password
                })
                
                setCurrentUser(res?.data);
                navigate("/");
            } catch(err) {
                console.log("SignUp Error: ", err.message);
            }
        }
    };

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='w-[350px] md:w-[550px] rounded-lg shadow-sm bg-gradient-to-tr from-blue-500 to-blue-600'>
                <div className='p-8 flex flex-col gap-3'>
                    <h2 className='font-bold text-xl md:text-2xl w-full flex justify-center'>Create an Account</h2>
                    <div className='flex flex-col w-full items-center'>
                        <div className='flex gap-5 items-end'>
                            <h4>Name</h4>
                            <input
                                type="text"
                                className='bg-transparent border-b-2 focus:outline-none px-3 py-1'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex gap-5 items-end'>
                            <h4>Username</h4>
                            <input
                                type="text"
                                className='bg-transparent border-b-2 focus:outline-none px-3 py-1'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex gap-5 items-end'>
                            <h4>Email</h4>
                            <input
                                type="email"
                                className='bg-transparent border-b-2 focus:outline-none px-3 py-1'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex gap-5 items-end'>
                            <h4>Password</h4>
                            <input
                                type="password"
                                className='bg-transparent border-b-2 focus:outline-none px-3 py-1'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div onClick={handleSignup} className='mt-6 text-white bg-black px-8 py-2 rounded-lg hover:bg-white hover:text-black cursor-pointer'>
                            Sign Up
                        </div>
                        <div onClick={() => setLogin(!login)} className='mt-4 text-white underline cursor-pointer'>
                            Already have an account? Login
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
