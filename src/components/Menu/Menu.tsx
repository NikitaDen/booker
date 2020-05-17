import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import Context from './../../context';
import './menu.scss';

const Menu = () => {
    const {token, logout} = useContext(Context);

    return (
        <nav>
            <h3>Menu</h3>
            <ul>
                <li><NavLink to={'/events'}>Events</NavLink></li>
                {!token ? <li><NavLink to={'/auth'}>Sign in</NavLink></li> : null}
                {token ? <>
                    <li><NavLink to={'/bookings'}>Bookings</NavLink></li>
                    <li><button className={'btn btn--logout'} onClick={logout}>Logout</button></li>
                </> : null}
            </ul>
        </nav>
    )
};

export default Menu