import React from 'react';

interface dataTypes {
  id: number;
  name: string; // Corrected type to 'string'
  email: string;
}

export default async function Page() { // Capitalized 'Page' for convention
  const data = await (await fetch('http://localhost:5000/users')).json();
  console.log(data);

  // Return an array of JSX elements from the map function
  return (
    <>
      <p>Hello world</p>
      <br />
      {data.map((user: dataTypes) => ( // Added parentheses for clarity
        <ul key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <br />
        </ul>
      ))}
    </>
  );
}

