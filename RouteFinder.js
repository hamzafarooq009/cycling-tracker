import React, { useState } from 'react';
import axios from 'axios';

const RouteFinder = ({ setRoute }) => { // Prop from App to set the route in the parent state
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [localRoute, setLocalRoute] = useState(null); // Local state for the route

    const getRoute = async () => {
        try {
            const accessToken = 'ACCESS-TOKEN';
            const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${start};${end}?access_token=${accessToken}`;
            
            const response = await axios.get(url);
            const firstRoute = response.data.routes[0];
            setLocalRoute(firstRoute); // Update the local route state
            setRoute(firstRoute); // Lift the state up to the App component
        } catch (error) {
            console.error('Error fetching the route:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="Start location (longitude,latitude)"
            />
            <input
                type="text"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="End location (longitude,latitude)"
            />
            <button onClick={getRoute}>Find Route</button>

            {/* Display the local route details */}
            {localRoute && <div>Route details: {JSON.stringify(localRoute)}</div>}
        </div>
    );
};

export default RouteFinder;