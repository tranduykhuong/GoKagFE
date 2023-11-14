import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './InputCT.module.scss';
import useMergeState from '../../hook/useMergeState';

const InputCT = (props) => {
  const {
    type,
    placeholder,
    title,
    message,
    required,
    standard,
    nonLabel,
    validation,
    defaultValue,
    setValue,
    flex,
    ...passProps
  } = props;

  const [state, setState] = useMergeState({
    isFocus: -1,
    type,
    error: message,
  });
  const [data, setData] = useState(defaultValue || '');
  const inputRef = useRef();

  const handleChange = (e) => {
    setState({ error: '' });
    const { value } = e.target;

    if (value === '') {
      setData('');
    } else if (state.type === 'tel') {
      const pattern = /\b([0-9]|10)\b/;
      if (pattern.test(value[value.length - 1])) {
        setData(value);
      }
    } else {
      setData(value);
    }
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    if (value === '') {
      setState({ isFocus: 0 });
    }

    if (required && value === '') {
      setState({ error: 'This is a required field!' });
      return;
    }
    if (validation && value !== '') {
      const error = validation({ value });
      setState({ error });
    }
  };

  const handleClickEye = () => {
    if (state.type === 'password') setState({ type: 'text' });
    else setState({ type: 'password' });
  };

  useEffect(() => {
    if (state.isFocus === 1) {
      inputRef.current.focus();
    }
  }, [state.isFocus]);

  useEffect(() => {
    setState({ error: message });
  }, [message]);

  useEffect(() => {
    if (defaultValue) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setData(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      if (setValue) {
        setValue(data);
      }
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [data, 500]);

  return (
    <>
      <div
        className={`${classes.inputCT} ${standard ? classes.standard : undefined}`}
        style={{ paddingTop: `${nonLabel ? '0' : ''}`, flex: `${flex ? 1 : undefined}` }}
      >
        {nonLabel && title && <h4 className={classes.inputCT__title}>{title}</h4>}
        <input
          onFocusCapture={() => setState({ isFocus: 1 })}
          onBlur={handleBlur}
          onChange={handleChange}
          value={data}
          type={state.type}
          placeholder={nonLabel ? placeholder : ''}
          ref={inputRef}
          {...passProps}
        />
        {type === 'password' && (
          <div className={classes['input-eye']} onClick={handleClickEye}>
            {state.type === 'password' ? (
              <FontAwesomeIcon className={classes['input-eye__icon']} icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon className={classes['input-eye__icon']} icon={faEye} />
            )}
          </div>
        )}
        {!nonLabel && (
          <span
            className={`${classes.label} 
        ${state.isFocus === 1 && classes.focusAnimate}
        ${state.isFocus === 0 && classes.unFocusAnimate}`}
            onClick={() => setState({ isFocus: 1 })}
          >
            {placeholder}
          </span>
        )}
      </div>
      <div className={classes.message}>{state.error && <span>{state.error}</span>}</div>
    </>
  );
};

InputCT.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  message: PropTypes.string,
  required: PropTypes.bool,
  validation: PropTypes.func,
  setValue: PropTypes.func,
};

InputCT.defaultProps = {
  type: 'text',
  placeholder: '',
  message: undefined,
  required: false,
  validation: null,
  setValue: null,
};

export default InputCT;
