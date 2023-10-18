import { useState } from 'react';

export function App () {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: <b>{count}</b></p>
      <button onClick={() => setCount((value) => value - 1)}>Decrease</button>
      <button onClick={() => setCount((value) => value + 1)}>Increase</button>
    </div>
  );
}
