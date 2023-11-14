import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import classes from './SelectOption.module.scss';

const SelectOption = ({ options, defaultValue, setSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || 'Select');
  const divRef = useRef();

  const handleSelect = (item) => {
    if (item !== selected) setIsOpen(false);
    setSelected(item);

    if (setSelect) {
      setSelect(item);
    }
  };

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className={classes.selectOption} ref={divRef}>
      <div className={classes.selectOption__select} onClick={() => setIsOpen((prev) => !prev)}>
        <p>{selected}</p>
        <FontAwesomeIcon icon={faSortDown} />
      </div>
      <div
        className={`${classes.selectOption__option} ${isOpen ? classes['selectOption__option--active'] : undefined}`}
      >
        {options &&
          options.map((item, idx) => (
            <div
              className={`${classes.selectOption__item} ${
                selected === item ? classes['selectOption__item--active'] : undefined
              }`}
              onClick={() => handleSelect(item)}
              key={+idx}
            >
              {item}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectOption;
