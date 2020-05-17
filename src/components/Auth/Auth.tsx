import React, {useContext, useState} from "react";
import axios from 'axios';
import Context from './../../context';
import './auth.scss'

const Auth = () => {
    // const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signMode, setSignMode] = useState(true);
    const {login} = useContext(Context);

    const signInHandler = (event: any) => {
        event.preventDefault();
        setSignMode(prev => !prev)
    };

    const signUpHandler = async (event: any) => {
        event.preventDefault();
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody: any = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email,
                password
            }
        };

        if (!signMode) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email,
                    password
                }
            }
        }

        const response = await axios.post('http://localhost:4000/graphql', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed!');
        }

        if (response.data.data.login.token || undefined) {
            login(response.data.data.login.token, response.data.data.login.userId)
        }
    };

    return (
        <>
            <h1>Auth page</h1>
            <form className={'form'} action="">
                <div className={'form__element'}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className={'form__element'}>
                    <label htmlFor="email">Password</label>
                    <input type="password" id='password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className={'form__actions'}>
                    <button onClick={signInHandler}>{signMode ? 'Switch Sing in' : 'Switch Sing up'}</button>
                    <button onClick={signUpHandler}>Enter</button>
                </div>

            </form>

        </>
    )
};

export default Auth;