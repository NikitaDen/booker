import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import Context from "../../context";
import Loader from "../Loader/Loader";
import BookingList from "./BookingList";

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState<any>([]);
    const {token} = useContext(Context);


    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setIsLoading(true);
        const requestBody: any = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
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

        setBookings(response.data.data.bookings);
        setIsLoading(false);
    };

    const onDeleteBooking = async (bookingId: any) => {
        setIsLoading(true);

        const requestBody: any = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
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

        setIsLoading(false);
        setBookings((prev: any) => {
            return prev.filter((item: any) => item._id !== bookingId)
        });
    };

    return (
        <>
            <h1>Bookings page</h1>
            <ul>
                {isLoading ? <Loader/> : <BookingList onDelete={onDeleteBooking} bookings={bookings}/>}
            </ul>
        </>
    )
};

export default Bookings;