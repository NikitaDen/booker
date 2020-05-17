import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Auth from "./components/Auth/Auth";
import Events from "./components/Events/Events";
import Bookings from "./components/Bookings/Bookings";
import Menu from "./components/Menu/Menu";
import Context from './context';
import './assets/styles/styles.scss';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    // const [userId, setUserId] = useState('');

    const login = (token: string, userId: string) => {
        setToken(token);
        // setUserId(userId);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setToken('');
        // setUserId('');
        localStorage.setItem('token', '');
    };

    return (
        <BrowserRouter>
            <Context.Provider value={{token, login, logout}}>
                <div className={'wrapper'}>
                    <Menu/>
                    <main>
                        <Switch>
                            {token ? <Redirect from={'/'} to={'/events'} exact/> : null}
                            {token ? <Redirect from={'/auth'} to={'/events'} exact/> : null}
                            {!token && <Route path={'/auth'} render={() => <Auth/>}/>}
                            <Route path={'/events'} render={() => <Events/>}/>
                            {token && <Route path={'/bookings'} render={() => <Bookings/>}/>}
                            {!token ? <Redirect to={'/auth'} exact/> : null}
                        </Switch>
                    </main>
                </div>
            </Context.Provider>
        </BrowserRouter>
    );
};

export default App;
