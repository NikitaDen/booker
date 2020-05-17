import React from "react";
import EventItem from "./EventItem";

const EventList = (props: any) => {
    return (
        <section className={'events'}>
            <ul>
                {props.events.length > 0 && props.events.map((item: any) => <EventItem key={item._id} onDetail={props.onDetail} creatorId={item.creator._id} eventId={item._id} userId={props.userId} title={item.title} price={item.price}/>)}
            </ul>
        </section>
    )
};

export default EventList;