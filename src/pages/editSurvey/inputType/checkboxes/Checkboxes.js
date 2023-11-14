/* eslint-disable func-names */
/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import classes from './Checkboxes.module.scss';
import ButtonCT from '../../../../components/button/ButtonCT';

const Checkboxes = ({ disabled, edit, type, options, sequence, handleBlur, setValue }) => {
  let timeoutId;
  const [data, setData] = useState(options);
  const [selected, setSelected] = useState([]);

  const handleAddOption = () => {
    const tmp = data;
    setData((prev) => [...prev, { value: `Option ${tmp.length + 1}` }]);
  };

  const handleRemove = (idx) => {
    const tmp = data[idx];
    const updatedItems = data.filter((item) => item !== tmp);
    setData(updatedItems);
  };

  const handleChangeValueOption = (e, idx) => {
    const tmp = data[idx];
    const updatedItems = data.map((item) => {
      if (item === tmp) {
        return { ...item, value: e.target.value };
      }
      return item;
    });
    setData(updatedItems);
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  // Deboucing to update Options back to Parent
  const debounce = (func, delay) =>
    function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (func) {
          func(...args);
        }
      }, delay);
    };
  const debouncedHandleChange = debounce(handleBlur, 1000);

  useEffect(() => {
    debouncedHandleChange({
      options: data,
      sequence,
    });
    return () => clearTimeout(timeoutId);
  }, [data]);

  const handleChangeValue = (e) => {
    if (type === 'radio') {
      setSelected([e.target.value]);
      return;
    }

    if (e.target.checked) {
      const tmp = [...selected];
      tmp.push(e.target.value);
      setSelected(tmp);
    } else {
      const tmp = selected.filter((item) => item !== e.target.value);
      setSelected(tmp);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (setValue) {
        setValue(selected.join(', '));
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [selected]);

  return (
    <div className={`${classes.checkboxes} ${disabled ? classes['checkboxes--disabled'] : undefined}`}>
      {data.map((_item, idx) => (
        <div className={classes.checkboxes__item} key={+idx}>
          {edit ? ( // Edit
            <div className={classes['checkboxes__item-label']}>
              <label htmlFor={sequence + _item.value} style={{ pointerEvents: 'none' }}>
                <input type={type} id={sequence + _item.value} />
              </label>
              <input
                type="text"
                placeholder="hello"
                value={_item.value}
                style={{ pointerEvents: 'inherit' }}
                onFocus={handleFocus}
                onChange={(e) => handleChangeValueOption(e, idx)}
              />
            </div>
          ) : (
            // View
            <div className={classes['checkboxes__item-label']}>
              <label htmlFor={sequence + _item.value} style={{ pointerEvents: `${disabled ? 'none' : 'inherit'}` }}>
                <input
                  type={type}
                  id={sequence + _item.value}
                  name={`input_${sequence}`}
                  onChange={handleChangeValue}
                  value={_item.value}
                  style={{ pointerEvents: `${disabled ? 'none' : 'inherit'}` }}
                />
                {_item.value}
              </label>
            </div>
          )}
          {edit && !disabled && (
            <div className={classes['checkboxes__item-close']} onClick={() => handleRemove(idx)}>
              <FontAwesomeIcon icon={faClose} fontSize={20} />
            </div>
          )}
        </div>
      ))}
      {edit && !disabled && (
        <div style={{ marginTop: '14px' }}>
          <ButtonCT standard small onClick={handleAddOption}>
            Add option
          </ButtonCT>
        </div>
      )}
    </div>
  );
};

export default Checkboxes;
