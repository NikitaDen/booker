import React from "react";
import BookingItem from "./BookingItem";

const BookingList = (props: any) => {
    return (
        <ul className={'bookings'}>
            {props.bookings.map((item: any) => <BookingItem key={item._id} onDelete={props.onDelete} bookingId={item._id} title={item.event.title} createdAt={item.createdAt}/>)}
        </ul>
    )
};

export default BookingList;