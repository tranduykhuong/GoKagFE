import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import classes from './FormAnswer.module.scss';
import InputText from '../editSurvey/inputType/inputText/InputText';
import Checkboxes from '../editSurvey/inputType/checkboxes/Checkboxes';
import ButtonCT from '../../components/button/ButtonCT';
import useAxios from '../../hook/useAxios';
import { Loading } from '../../components/loading/Loading';
import { axiosClient } from '../../api/axios';

const FormAnswer = () => {
  const path = useLocation();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, error, isLoading] = useAxios('get', `/questionnaire/${path.pathname.split('/')[2]}/`, {}, {}, []);

  const handleBeforeUnload = (e) => {
    if (!isSuccess) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  const handleChooseAnswer = (value, idx) => {
    const answersUpdated = [...answers];
    if (answersUpdated[idx].value !== value) {
      console.log(value);
      answersUpdated[idx].isValid = !answersUpdated[idx].required || value !== '';
    }
    answersUpdated[idx].value = value;
    setAnswers(answersUpdated);
  };

  const handleNewSubmit = () => {
    setIsSuccess(false);
    const answersData = response.data.questions.map((item) => ({
      questionnaire: response.data.id,
      question_key: item.key,
      value: '',
      required: item.question_detail.required,
      isValid: true,
    }));
    setAnswers(answersData);
  };

  const handleSubmit = async () => {
    let isValidData = true;
    const tmp = [...answers];

    for (let i = 0; i < answers.length; i += 1) {
      if (answers[i].required && answers[i].value === '') {
        tmp[i].isValid = false;
        isValidData = false;
      }
    }

    if (!isValidData) {
      toast.error('Please fill in all questions!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setAnswers(tmp);
    } else {
      try {
        setIsSubmitting(true);
        await axiosClient.post('/answer/', answers);
        setIsSuccess(true);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      } catch (e) {
        console.log(e);
        toast.error('Submit error! Please try again!', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (response) {
      console.log(response);
      if (response.data.is_public) {
        setData(response.data.questions);
        const answersData = response.data.questions.map((item) => ({
          questionnaire: response.data.id,
          question_key: item.key,
          value: '',
          required: item.question_detail.required,
          isValid: true,
        }));
        setAnswers(answersData);
      } else {
        setData([]);
      }
    }
  }, [response]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers]);

  return (
    <div className={classes.formAnswer}>
      <Helmet>{response && <title>{`GoKag - ${response.data.title}`}</title>}</Helmet>
      {isSuccess ? ( // Post success
        <div className={classes.formAnswer__form}>
          <div className={classes.formAnswer__heading}>
            <h2 className={classes['formAnswer__heading-title']}>SUBMIT SUCCESSFULLY!</h2>
            <div className={classes['formAnswer__heading-success']} onClick={handleNewSubmit}>
              Submit a new response
            </div>
            <Link to={path.state || '/'} className={classes['formAnswer__heading-summary']}>
              <ButtonCT primary medium outlineBtn>
                Back to GoKag
              </ButtonCT>
            </Link>
          </div>
        </div>
      ) : !isLoading && error ? ( // Not found
        <div className={classes.formAnswer__form}>
          <div className={classes.formAnswer__heading}>
            <h2 className={classes['formAnswer__heading-title']}>NOT FOUND</h2>
            <Link to={path.state || '/'} className={classes['formAnswer__heading-summary']}>
              <ButtonCT primary medium outlineBtn>
                Back to GoKag
              </ButtonCT>
            </Link>
          </div>
        </div>
      ) : isLoading || !data ? ( // Loading
        <Loading />
      ) : !response.data.is_public || !response.data.is_collecting ? ( // Private or No survey
        <div className={classes.formAnswer__form}>
          <div className={classes.formAnswer__heading}>
            <h2 className={classes['formAnswer__heading-title']}>{response.data.title}</h2>
            {!response.data.is_public && (
              <>
                <p>Survey in private mode</p>
                <br />
              </>
            )}
            {!response.data.is_collecting && <p>The survey is no longer accepting responses</p>}
            <br />
            <Link to={path.state || '/'} className={classes['formAnswer__heading-summary']}>
              <ButtonCT primary medium outlineBtn>
                Back to GoKag
              </ButtonCT>
            </Link>
          </div>
        </div>
      ) : (
        // Data
        <div className={classes.formAnswer__form}>
          <div className={classes.formAnswer__heading}>
            <h2 className={classes['formAnswer__heading-title']}>{response.data.title}</h2>
            <p className={classes['formAnswer__heading-summary']}>{response.data.summary}</p>
          </div>
          <div className={classes.formAnswer__body}>
            {data.map((_item, idx) => (
              <div key={+idx}>
                <p className={classes['formAnswer__body-question']}>
                  <span>{_item.label}</span>
                  {_item.question_detail.required ? <span>*</span> : <span />}
                </p>
                <div className={classes['formAnswer__body-input']}>
                  {_item.type === 'InputType' && <InputText setValue={(value) => handleChooseAnswer(value, idx)} />}
                  {_item.type === 'SelectType' &&
                    (_item.question_detail.multiselect ? (
                      <Checkboxes
                        type="checkbox"
                        options={[..._item.question_detail.options]}
                        sequence={_item.sequence}
                        setValue={(value) => handleChooseAnswer(value, idx)}
                      />
                    ) : (
                      <Checkboxes
                        type="radio"
                        options={[..._item.question_detail.options]}
                        sequence={_item.sequence}
                        setValue={(value) => handleChooseAnswer(value, idx)}
                      />
                    ))}
                  <p
                    className={classes['formAnswer__body-required']}
                    style={{ visibility: `${answers[idx].isValid ? 'hidden' : 'visible'}` }}
                  >
                    This is a required question
                  </p>
                </div>
              </div>
            ))}
            <div className={classes['formAnswer__body-submit']}>
              <ButtonCT
                primary
                large
                borderRadius
                loading={isSubmitting}
                style={{ width: '100px' }}
                onClick={handleSubmit}
              >
                Submit
              </ButtonCT>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAnswer;
