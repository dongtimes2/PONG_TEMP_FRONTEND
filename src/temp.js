import React, {useEffect, useState} from 'react';

export default function App() {
  const [address, setAddress] = useState({country: '', city: ''});

  // 👇️ objects/arrays are different on re-renders
  const obj = {country: 'Chile', city: 'Santiago'};

  useEffect(() => {
    setAddress(obj);
    console.log('useEffect called');

    // ⛔️ React Hook useEffect has a missing dependency: 'obj'.
    // Either include it or remove the dependency array. eslintreact-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Country: {address.country}</h1>
      <h1>City: {address.city}</h1>
    </div>
  );
}