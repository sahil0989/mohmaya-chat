import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function Auth() {
    const [login, setLogin] = useState(true);

    const toggleAuth = () => {
        setLogin(!login);
    };

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            {
                login ? 
                <Login login={login} setLogin={setLogin} /> :
                <Signup login={login} setLogin={setLogin} />
            }
            <div className='mt-4'>
                <button
                    onClick={toggleAuth}
                    className='text-blue-500 underline cursor-pointer'
                >
                    {login ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}

export default Auth;
