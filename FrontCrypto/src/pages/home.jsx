import { Button, TextInput } from "@mantine/core";
import React, { useState } from 'react';
// import { Redirect } from 'react-router-dom'; // Importer Redirect
//import { BrowserRouter as Router, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

export default function Home() {    
    const [responseData, setResponseData] = useState('');
    const [name, setName] = useState('');

    const postRequest = async () => {
        try {
            // Données à envoyer dans la requête POST
            const requestData = {
                username: name, // Remplacez par le nom d'utilisateur réel
                tokenData: { /* Données de jeton */ }
            };
    
            // Options de la requête
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Vous pouvez également inclure d'autres en-têtes si nécessaire
                },
                body: JSON.stringify(requestData) // Conversion des données en JSON
            };
    
            // Envoi de la requête POST
            const response = await fetch('http://localhost:5000/firstco', requestOptions);
            const responseData = await response.json();
            console.log(responseData);
            setResponseData(responseData.message); // Afficher le message de la réponse
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
          <div>
            <h1>Bienvenue sur notre plateforme de vêtements</h1>
            <p>Découvrez nos dernières collections et offres spéciales.</p>
      
            <h2>Post to Server</h2>
            <p>Response: {responseData}</p>
            <TextInput
              radius="md"
              label="Input label"
              description="Input description"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <Button 
              disabled={name === ''}
              onClick={postRequest} >Send POST Request</Button>
          </div>
      );
    }

//     return (
//         <div>
//             <h1>Bienvenue sur notre plateforme de vêtements</h1>
//             <p>Découvrez nos dernières collections et offres spéciales.</p>

//             <h2>Post to Server</h2>
//             <p>Response: {responseData}</p>
//             <TextInput
//                 radius="md"
//                 label="Input label"
//                 description="Input description"
//                 placeholder="Your name"
//                 value={name}
//                 onChange={(event) => setName(event.currentTarget.value)}
//                 />
//             <Button 
//                 disabled={name === ''}
//                 onClick={postRequest} >Send POST Request</Button>
//         </div>
//     );
// }