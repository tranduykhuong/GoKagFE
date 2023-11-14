import React, { useEffect, useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import './MyProgressBar.scss';

const MyProgressBar = ({ miliseconds, start, end }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const handleIncrease = () => {
      const per = parseInt((9000 * 2) / miliseconds, 10);
      setPercent((prev) => prev + per);
    };
    if (!start) return;

    const timer = setInterval(() => {
      handleIncrease();
    }, 200);

    if (end) {
      setPercent(100);
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [start, end]);

  return (
    <div style={{ width: '100%' }}>
      <ProgressBar completed={percent === 100 ? 100 : percent < 90 ? percent : 90} />
    </div>
  );
};

export default MyProgressBar;
