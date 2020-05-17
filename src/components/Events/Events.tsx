import React, {useContext, useEffect, useState} from "react";
import Modal from "../Modal/Modal";
import BackDrop from "../BackDrop/BackDrop";
import axios from "axios";
import Context from "../../context";
import EventList from "./EventList";
import Loader from "../Loader/Loader";


const Events = () => {
    const [createMode, setCreateMode] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('1');
    const {token, userId} = useContext(Context);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    let isActive = true;

    useEffect(() => {
        fetchEvents();

        return () => {
            isActive = false
        }
    }, []);

    const modalConfirmHandler = async () => {

        if (title.trim().length === 0 ||
            +price <= 0 ||
            description.trim().length === 0 ||
            date.trim().length === 0) {
            return
        }

        const requestBody: any = {
            query: `
                mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
                    createEvent(eventInput: {
                        title: $title,
                        description: $description,
                        price: $price,
                        date: $date,
                    }) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `,
            variables: {title, description, price: +price, date}
        };

        const response = await axios.post('http://localhost:4000/graphql', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed!');
        }

        const updateEvents: any = events;
        updateEvents.push({
            _id: response.data.data.createEvent._id,
            title: response.data.data.createEvent.title,
            description: response.data.data.createEvent.description,
            date: response.data.data.createEvent.date,
            price: response.data.data.createEvent.price,
            creator: {
                _id: userId
            }
        });

        setEvents(updateEvents);
        setCreateMode(false);
    };

    const modalCancelHandler = () => {
        setCreateMode(false);
        setSelectedEvent(null);
    };

    const showDetail = (eventId: any) => {
        const selectedEvent = events.find((item: any) => item._id === eventId);
        setSelectedEvent(selectedEvent);
    };

    const bookEventHandler = async () => {
        if (!token) {
            setSelectedEvent(null);
            return;
        }

        const requestBody: any = {
            query: `
                mutation BookEvent($id: ID!) {
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {id: selectedEvent._id}
        };

        const response = await axios.post('http://localhost:4000/graphql', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed!');
        }

        setSelectedEvent(null);
    };

    const fetchEvents = async () => {
        setIsLoading(true);

        const requestBody: any = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        const response = await axios.post('http://localhost:4000/graphql', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status !== 200 && response.status !== 201) {
            setIsLoading(false);
            throw new Error('Failed!');
        }

        const events = response.data.data.events;

        if (isActive) {
            setEvents(events);
            setIsLoading(false);
        }
    };

    return (
        <>
            {createMode || selectedEvent && <BackDrop/>}
            {createMode && <>
                <Modal title={'Add event'} btnTitle={'Confirm'} onCancel={modalCancelHandler} onConfirm={modalConfirmHandler} canCancel
                       canConfirm>
                    <form className={'form'} action="">
                        <div className={'form__element'}>
                            <label htmlFor="title">Title</label>
                            <input type="text" id={'title'} value={title}
                                   onChange={(e) => setTitle(e.currentTarget.value)}/>
                        </div>
                        <div className={'form__element'}>
                            <label htmlFor="price">Price</label>
                            <input type="number" id={'price'} value={price}
                                   onChange={(e) => setPrice(e.currentTarget.value)}/>
                        </div>
                        <div className={'form__element'}>
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id={'date'} value={date}
                                   onChange={(e) => setDate(e.currentTarget.value)}/>
                        </div>
                        <div className={'form__element'}>
                            <label htmlFor="description">Description</label>
                            <textarea id={'description'} value={description}
                                      onChange={(e) => setDescription(e.currentTarget.value)}/>
                        </div>
                    </form>
                </Modal>
            </>}

            {selectedEvent && <Modal title={selectedEvent.title} btnTitle={'Book'} onCancel={modalCancelHandler} onConfirm={bookEventHandler} canCancel
                                     canConfirm>
                <h1>{selectedEvent.title}</h1>
                <h2>${selectedEvent.price}</h2>
                <p>{selectedEvent.date}</p>
            </Modal>}

            {token && <div>
                <button onClick={() => setCreateMode(true)}>Create Event</button>
            </div>}

            {isLoading ? <Loader/> : <EventList onDetail={showDetail} events={events} userId={userId}/>}
        </>
    )
};

export default Events;