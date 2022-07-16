import { useEffect, useState } from 'react';

const Loading = () => {
  const [dot, setDot] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDot((prev) => {
        return prev === '...' ? '' : prev + '.';
      });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div>상대방을 기다리는 중{dot}</div>
    </>
  );
};

export default Loading;
