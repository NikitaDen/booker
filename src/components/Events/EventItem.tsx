import React from "react";

const EventItem = (props: any) => {
    return (
        <li>
            {props.title}
            {props.price}
            {props.userId === props.creatorId ? <span>You are the owner</span> : <button onClick={() => props.onDetail(props.eventId)}>More</button>}
        </li>
    )
};

export default EventItem;