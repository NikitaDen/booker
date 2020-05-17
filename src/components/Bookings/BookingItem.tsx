import React from "react";
import './booking-item.scss';

const BookingItem = (props: any) => {
    return (
        <li className={'bookings__item'}>
            <div>
                {props.title} - {props.createdAt}
            </div>
            <button onClick={() => props.onDelete(props.bookingId)}>Cancel</button>
        </li>
    )
};

export default BookingItem;