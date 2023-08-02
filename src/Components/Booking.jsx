import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
    Box, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, VStack, FormControl, FormLabel, Input, Select, Button, Text, UnorderedList, ListItem
} from '@chakra-ui/react';

const facilitiesConfig = [
    {
        name: 'Clubhouse',
        slots: [
            { startTime: '10:00', endTime: '16:00', price: 100 },
            { startTime: '16:00', endTime: '22:00', price: 500 },
        ],
    },
    {
        name: 'Tennis Court',
        slots: [{ startTime: '00:00', endTime: '23:59', price: 50 }],
    },
];

const Booking = () => {
    const [facility, setFacility] = useState(facilitiesConfig[0].name);
    const [date, setDate] = useState('2023-08-01');
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('11:00');
    const [bookings, setBookings] = useState([]);

    const isSlotAvailable = (facility, date, startTime, endTime) => {
        return !bookings.some(
            (booking) =>
                booking.facility === facility &&
                booking.date === date &&
                ((startTime >= booking.startTime && startTime < booking.endTime) ||
                    (endTime > booking.startTime && endTime <= booking.endTime) ||
                    (startTime <= booking.startTime && endTime >= booking.endTime))
        );
    };

    const handleBooking = () => {
        if (!isSlotAvailable(facility, date, startTime, endTime)) {
            alert('Booking Failed,  Already Booked');
            setBookings([
                ...bookings,
                { facility, date, startTime, endTime, message: 'Booking Failed, Already Booked' },
            ]);
            return;
        }

        const facilityConfig = facilitiesConfig.find((config) => config.name === facility);
        if (!facilityConfig) {
            alert('Invalid facility selected.');
            return;
        }

        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        const bookingDuration = (end - start) / (1000 * 60 * 60); // in hours

        let totalPrice = 0;
        for (const slot of facilityConfig.slots) {
            const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
            const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
            const slotDuration = (slotEnd - slotStart) / (1000 * 60 * 60); // in hours

            if (start >= slotStart && end <= slotEnd && bookingDuration <= slotDuration) {
                totalPrice = slot.price * bookingDuration;
                break;
            }
        }

        if (totalPrice > 0) {
            setBookings([...bookings, { facility, date, startTime, endTime, totalPrice }]);

            alert(`Booked, Rs. ${totalPrice}`);
        } else {

            alert('Booking Failed, Invalid Slot');
        }
    };

    return (
        
            <Box maxW="800px" mx="auto" p={4}>
                <VStack spacing={4}>
                    <Text fontSize="xl" fontWeight="bold">Facility Booking App</Text>
                    <VStack spacing={2} w="100%">
                        <FormControl>
                            <FormLabel>Select Facility:</FormLabel>
                            <Select value={facility} onChange={(e) => setFacility(e.target.value)}>
                                {facilitiesConfig.map((facility) => (
                                    <option key={facility.name} value={facility.name}>
                                        {facility.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Select Date:</FormLabel>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Select Start Time:</FormLabel>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Select End Time:</FormLabel>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </FormControl>
                        <Button colorScheme="blue" onClick={handleBooking}>Book</Button>
                    </VStack>
                    <VStack spacing={2} w="100%">
                        <Text fontSize="xl" fontWeight="bold">Bookings</Text>
                        <TableContainer>
                            <Table variant='striped' colorScheme='teal'>
                                <Thead>
                                    <Tr>
                                        <Th>Facility</Th>
                                        <Th>Date</Th>
                                        <Th >Start Time</Th>
                                        <Th >End Time</Th>
                                        <Th >Price (INR)/Message</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {bookings.map((booking, index) => (
                                        <Tr key={index}>
                                            <Td>{booking.facility}</Td>
                                            <Td>{booking.date}</Td>
                                            <Td>{booking.startTime}</Td>
                                            <Td>{booking.endTime}</Td>
                                            <Td>{booking.message ? booking.message : booking.totalPrice}</Td>
                                        </Tr>
                                    ))}

                                </Tbody>

                            </Table>
                        </TableContainer>



                    </VStack>
                </VStack>
            </Box>
        
    );
};

export default Booking