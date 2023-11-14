import React, { useEffect, useState } from 'react';
import classes from './InputText.module.scss';

const InputText = ({ disabled, setValue }) => {
  const [isForcus, setIsFocus] = useState(false);
  const [data, setData] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (setValue) {
        setValue(data);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [data]);

  return (
    <div className={`${classes.inputText} ${disabled ? classes['inputText--disabled'] : undefined}`}>
      <input
        placeholder="Your answer"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <span className={`${classes.inputText__line} ${isForcus ? classes.inputText__animate : undefined}`} />
    </div>
  );
};

export default InputText;
