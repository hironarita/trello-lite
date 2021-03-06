import React, { useState, useEffect } from 'react';
import { swal } from '../utilities/Utilities';
import { post } from '../utilities/Axios';

declare interface ILoginSignupProps {
    readonly logIn: () => void;
}
export function LoginSignup(props: ILoginSignupProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingIn, setIsLogginIn] = useState(true);

    const isLoginDisabled = username.length === 0 || password.length === 0;
    const isSignupDisabled = isLoginDisabled === true || confirmPassword.length === 0;
    const isButtonDisabled = (isLoggingIn === true
        ? isLoginDisabled === true
        : isSignupDisabled === true)
        || isLoading === true;

    // cleanup
    useEffect(() => { return () => setIsLoading(false) }, [isLoading]);

    const logIn = async () => {
        setIsLoading(true);
        try {
            await post('/account/login', { username, password });
            props.logIn();
        } finally {
            setIsLoading(false);
        }
    };

    const register = async () => {
        if (password.length < 6) {
            return swal.fire({
                title: 'Error!',
                text: 'Please make sure your password is at least 6 characters',
                icon: 'error'
            });
        }

        if (password !== confirmPassword) {
            return swal.fire({
                title: 'Error!',
                text: 'Please make sure your passwords match',
                icon: 'error'
            });
        }

        setIsLoading(true);
        try {
            await post('/account/register', { username, password });
            props.logIn();
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (key: string) => {
        if (key === 'Enter' && isButtonDisabled === false) {
            isLoggingIn === true ? logIn() : register();
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vw-100 login-signup-container'>
            <form className='login-signup-form'>
                <h1 className='logged-out-logo text-center mb-5'>Kanban Lite</h1>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        id='username'
                        placeholder='Enter username'
                        disabled={isLoading === true} />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        className='form-control'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        id='password'
                        placeholder='Password'
                        disabled={isLoading === true}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (isLoggingIn === true) handleKeyPress(e.key) }} />
                </div>
                {isLoggingIn === false &&
                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            id='confirmPassword'
                            placeholder='Confirm password'
                            disabled={isLoading === true}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e.key)} />
                    </div>
                }
                <button
                    type='button'
                    className='btn login-btn w-100'
                    disabled={isButtonDisabled === true}
                    onClick={() => isLoggingIn === true ? logIn() : register()}>
                    {isLoggingIn === true ? 'Log In' : 'Sign Up'}
                </button>
                <div className='text-center mt-5'>
                    {isLoggingIn === true
                        ? <span className='login-question-text'>Don't have an account? <span className='login-link' onClick={() => setIsLogginIn(false)}>Sign up here</span></span>
                        : <span className='login-question-text'>Already have an account? <span className='login-link' onClick={() => setIsLogginIn(true)}>Log in here</span></span>
                    }
                </div>
            </form>
        </div>
    )
}