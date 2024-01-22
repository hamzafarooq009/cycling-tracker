import React, { useState } from 'react';
import axios from 'axios';
import './RouteFinder.css';

const RouteFinder = ({ setRoute }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [localRoute, setLocalRoute] = useState(null);
    const [adventureTip, setAdventureTip] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [conversation, setConversation] = useState([]);


    const mapboxAccessToken = 'TOKEN_HERE';

    const isValidCoordinate = (coord) => {
        return /^-?\d+\.\d+,-?\d+\.\d+$/.test(coord);
    };

    const formatCoordinate = (coord) => {
        return coord.trim().replace(/\s/g, '');
    };

    const getRoute = async () => {
        try {
            if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
                console.error("Invalid coordinates format");
                // Set an error state here to notify the user
                return;
            }

            const formattedStart = formatCoordinate(start);
            const formattedEnd = formatCoordinate(end);

            const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${formattedStart};${formattedEnd}?access_token=${mapboxAccessToken}`;
            const response = await axios.get(url);
            const firstRoute = response.data.routes[0];
            setLocalRoute(firstRoute);
            setRoute(firstRoute);
        } catch (error) {
            console.error('Error fetching the route:', error.response ? error.response.data : error.message);
        }
    };

    const getChatResponse = async () => {
    try {

        // System message
        const systemMessage = {
            role: "system",
            name: "situation",
            content: `<|im_start|>You are an adventurous travel guide. Provide interesting and adventurous travel tips for a cycling route. The user is planning to cycle from ${formatCoordinate(start)} to ${formatCoordinate(end)}. Words should be less than 150 words<|im_end|>`
        };

        // User message from the input
        const userMessageObj = {
            role: "user",
            content: userMessage // this is the message the user types into the input field
        };

        const messages = [systemMessage, userMessageObj];


        const data = {
            model: "julep-ai/samantha-1-turbo",
            prompt: `<|im_start|>You are an adventurous travel guide. Provide interesting and adventurous travel tips for a cycling route. The user is planning to cycle from ${formatCoordinate(start)} to ${formatCoordinate(end)}. Words should be less than 150 words<|im_end|>`,
            temperature: 0.6,
            max_tokens: 140,
            best_of: 2
        };

        const response = await axios.post('https://api-alpha.julep.ai/v1/completions', data, {
            headers: {
                'Authorization': `Bearer API_KEY_HERE`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].text;
        console.log(aiResponse)

        setConversation(conversation.concat(
            { role: "user", content: userMessage },
            { role: "assistant", content: aiResponse }
        ));

        setUserMessage('');
    } catch (error) {
        console.error('Error in the chatbot response:', error);
        console.error('Response status code:', error.response ? error.response.status : 'Unknown');
        console.error('Response data:', error.response ? error.response.data : 'No response data');
    }
};


const findRouteAndGetTips = async () => {
        await getRoute(); // First, find the route
        await getChatResponse(); // Then, get adventure tips
    };


return (
        <div className="route-finder container my-3">
            <div className="row">
                <div className="col">
                    <input
                        type="text"
                        className="form-control my-2"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        placeholder="Start location (longitude,latitude)"
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control my-2"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        placeholder="End location (longitude,latitude)"
                    />
                </div>
                <div className="col">
                <button 
                className="btn btn-primary my-2"
                style={{ backgroundColor: "#CCCFF7", borderColor: "#CCCFF7" }} // Custom color applied
                onClick={findRouteAndGetTips}>
                Find Route & Get Tips
                </button>
            </div>
            </div>

            <div className="chat-container bg-light p-3 border rounded">
                <div className="conversation-view mb-3">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                </div>
                <div className="message-input d-flex">
                    <input
                        type="text"
                        className="form-control"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Ask me about your route..."
                        onKeyPress={(e) => e.key === 'Enter' ? getChatResponse() : null}
                    />
                    <button className="btn btn-primary ml-"                 
                    style={{ backgroundColor: "#CCCFF7", borderColor: "#CCCFF7" }} // Custom color applied
                    onClick={getChatResponse}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default RouteFinder;
