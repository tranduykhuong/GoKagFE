import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faEllipsis, faShare } from '@fortawesome/free-solid-svg-icons';
import { faCopy, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import classes from './EditSurvey.module.scss';
import InputCT from '../../components/inputCT/InputCT';
import SelectOption from '../../components/selectOption/SelectOption';
import ToggleCheckbox from './toggleCheckbox/ToggleCheckbox';
import ButtonCT from '../../components/button/ButtonCT';
import InputText from './inputType/inputText/InputText';
import Checkboxes from './inputType/checkboxes/Checkboxes';
import { defaultQuestionDetail, typeInputMapping, notifyNotPermission } from './handleEditSurvey';
import useAxiosPrivate from '../../hook/useAxiosPrivate';
import useAxios from '../../hook/useAxios';
import useMergeState from '../../hook/useMergeState';
import { Loading } from '../../components/loading/Loading';
import auth from '../../utils/auth';

const TYPE_EDIT = {
  UPDATE: 1,
  VIEW: 2,
};

const EditSurvey = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [items, setItems] = useState([]);
  const [visibility, setVisibility] = useState('Private');
  const [surveying, setSurveying] = useState('Lock');
  const [idxActive, setIdxActive] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const [state, setState] = useMergeState({
    typeEdit: TYPE_EDIT.UPDATE,
  });

  const [data, error, isLoading] = useAxios('get', `/datasets/${path.pathname.split('/')[2]}/`, {}, {}, []);

  const getTypeOptionChange = (question) => {
    if (question.type === 'InputType') {
      return 'Short answer';
    }
    if (question.type === 'SelectType' && question.question_detail.multiselect) {
      return 'Checkboxes';
    }
    if (question.type === 'SelectType' && !question.question_detail.multiselect) {
      return 'Multiple choice';
    }
  };

  const handlePostNewQuestion = async (newQuestion, idx) => {
    const newItems = [...items];

    try {
      const res = await axiosPrivate.post('/question/', [newQuestion]);
      newItems.splice(idx + 1, 0, res.data.data[0]);
      const tmp = [...newItems];
      const object = tmp.map((item, idx) => ({
        ...item,
        sequence: idx + 1,
      }));
      setItems(object);
      setIdxActive(idx + 1);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePatchUpdateQuestion = async (itemUpdate) => {
    try {
      const newItems = [...items];
      const res = await axiosPrivate.patch(`/question/${itemUpdate.id}/`, itemUpdate);
      newItems[idxActive] = res.data.data;
      setItems(newItems);
    } catch (e) {
      console.log(e);
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async (result) => {
    if (state.typeEdit === TYPE_EDIT.UPDATE) {
      if (!result.destination) {
        return;
      }

      const cloneItems = [...items];
      const newItems = reorder(cloneItems, result.source.index, result.destination.index);
      const object = newItems.map((item, idx) => ({
        ...item,
        sequence: idx + 1,
      }));

      const itemUpdate = object[result.destination.index];

      try {
        setItems(newItems);
        await axiosPrivate.patch(`/question/${itemUpdate.id}/`, itemUpdate);
        setIdxActive(result.destination.index);
      } catch (e) {
        console.log(e);
      }
    } else {
      notifyNotPermission();
    }
  };

  const handleAddQuestion = async (idx) => {
    if (state.typeEdit === TYPE_EDIT.UPDATE) {
      const question = {
        type: 'InputType',
        label: 'Question',
        sequence: idx + 2,
        question_detail: defaultQuestionDetail.InputType,
        questionnaire: data.data.about.id,
      };
      handlePostNewQuestion(question, idx);
    } else {
      notifyNotPermission();
    }
  };

  const handleCopyQuestion = async (idx) => {
    if (state.typeEdit === TYPE_EDIT.UPDATE) {
      const copyItem = { ...items[idx] };
      copyItem.id = null;
      copyItem.sequence = idx + 2;
      if (copyItem.type === 'SelectType') {
        copyItem.question_detail.options = copyItem.question_detail.options.map((item) => ({
          value: item.value,
        }));
      }
      console.log(copyItem);
      handlePostNewQuestion(copyItem, idx);
    } else {
      notifyNotPermission();
    }
  };

  const handleRemoveQuestion = async (idx) => {
    if (state.typeEdit === TYPE_EDIT.UPDATE) {
      const itemDelete = items[idx];
      try {
        await axiosPrivate.delete(`/question/${itemDelete.id}/`, itemDelete);
        const newItems = [...items];
        newItems.splice(idx, 1);
        const object = newItems.map((item, idx) => ({
          ...item,
          sequence: idx + 1,
        }));
        setItems(object);
        setIdxActive(Math.max(idx - 1, 0));
      } catch (e) {
        console.log(e);
        toast.error('Delete question failed! Please try again!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } else {
      notifyNotPermission();
    }
  };

  const handleChangeType = (type) => {
    if (state.typeEdit === TYPE_EDIT.UPDATE) {
      const updateItem = { ...items[idxActive] };
      if (updateItem.type === 'SelectType' && typeInputMapping[type].type === 'SelectType') {
        updateItem.question_detail.multiselect = !items[idxActive].question_detail.multiselect;
      } else {
        updateItem.type = typeInputMapping[type].type;
        updateItem.question_detail = defaultQuestionDetail[typeInputMapping[type].inputType];
      }
      handlePatchUpdateQuestion(updateItem);
    } else {
      notifyNotPermission();
    }
  };

  const handleBlurOptions = (cbData) => {
    const tmp = items[idxActive];
    if (tmp.type === 'SelectType' && tmp.sequence === cbData.sequence) {
      const updatedItems = items.map((item) => {
        if (item === tmp) {
          const newItem = { ...item };
          newItem.question_detail.options = cbData.options;
          return newItem;
        }
        return item;
      });
      handlePatchUpdateQuestion(updatedItems[idxActive]);
    }
  };

  const handleChangeTitleQuestion = (idx, value) => {
    const updateItem = { ...items[idxActive] };
    if (idx === idxActive && value !== updateItem.label && value !== '') {
      updateItem.label = value;
      handlePatchUpdateQuestion(updateItem);
    }
  };

  const handleClickRequired = (idx, checked) => {
    const updateItem = { ...items[idxActive] };
    if (idxActive === idx) {
      updateItem.question_detail.required = checked;
      handlePatchUpdateQuestion(updateItem);
    }
  };

  const handleShare = async () => {
    const textToCopy = `${process.env.REACT_APP_DOMAIN}/answer/${data.data.about.slug}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.info('Copy link successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      console.error('Lỗi khi sao chép vào clipboard: ', err);
    }
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      if (data.data.about.author.id !== auth.getUser().id) {
        navigate('/');
      }

      if (data.data.about.questions.length === 0) {
        handleAddQuestion(-1);
        setState({ typeEdit: TYPE_EDIT.UPDATE });
      } else if (Object.keys(data.data.datasets).length === 0) {
        setState({ typeEdit: TYPE_EDIT.UPDATE });
        setItems(data.data.about.questions);
      } else {
        setState({ typeEdit: TYPE_EDIT.VIEW });
        setItems(data.data.about.questions);
      }
      setVisibility(data.data.about.is_public ? 'Public' : 'Private');
      setSurveying(data.data.about.is_collecting ? 'UnLock' : 'Lock');
      setTitle(data.data.about.title);
      setSummary(data.data.about.summary);
    }
  }, [data]);

  useEffect(() => {
    const handleUpdateInfo = async () => {
      const object = {
        title,
        summary,
        is_collecting: surveying === 'UnLock',
        is_public: visibility === 'Public',
      };

      try {
        const res = await axiosPrivate.patch(`/questionnaire/${data.data.about.id}/`, object);
        console.log(res);
        if (res && res.data.slug !== data.data.about.slug) {
          navigate(`/surveys/${res.data.slug}/edit`);
          data.data.about.slug = res.data.slug;
          data.data.about.title = res.data.title;
        }
        data.data.about.summary = res.data.summary;
        data.data.about.is_collecting = res.data.is_collecting;
        data.data.about.is_public = res.data.is_public;
      } catch (e) {
        console.log(e);
      }
    };
    if (
      data &&
      (title !== data.data.about.title ||
        summary !== data.data.about.summary ||
        data.data.about.is_collecting !== (surveying === 'UnLock') ||
        data.data.about.is_public !== (visibility === 'Public'))
    ) {
      handleUpdateInfo();
    }
  }, [title, summary, surveying, visibility]);

  useEffect(() => {
    if (!isLoading && error) {
      navigate('/404');
    }
  }, [error]);

  console.log(items);

  return (
    <div style={{ backgroundColor: '#edeaf2' }}>
      <div style={{ maxWidth: '1440px', margin: 'auto' }}>
        {isLoading || !data ? (
          <Loading />
        ) : (
          <div className={classes.createSurvey}>
            <div className={classes.createSurvey__info}>
              <h3>Survey Information</h3>
              <InputCT
                standard
                nonLabel
                title="Survey Title"
                type="text"
                required
                defaultValue={title}
                setValue={setTitle}
              />
              <InputCT standard nonLabel title="Summary" type="text" defaultValue={summary} setValue={setSummary} />
              <h5>Visibility</h5>
              <SelectOption options={['Private', 'Public']} defaultValue={visibility} setSelect={setVisibility} />
              <br />
              <h5>Surveying</h5>
              <SelectOption options={['Lock', 'UnLock']} defaultValue={surveying} setSelect={setSurveying} />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="vertical">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={classes.createSurvey__list}
                    style={{ listStyleType: 'none' }}
                  >
                    {items.map((_item, index) => (
                      <Draggable key={_item.sequence} draggableId={`item-${_item.id}`} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classes['createSurvey__list-item']}
                            style={{
                              userSelect: 'none',
                              margin: '0 0 8px 0',
                              ...provided.draggableProps.style,
                            }}
                            onClick={() => setIdxActive(index)}
                            role="presentation"
                          >
                            {/* LEFT */}
                            <div className={classes['createSurvey__list-item-left']}>
                              <p style={{ textAlign: 'center' }}>
                                <FontAwesomeIcon icon={faEllipsis} />
                              </p>
                              <div
                                className={`${classes['createSurvey__list-item-heading']} ${
                                  idxActive === index ? classes['createSurvey__list-item-heading--active'] : undefined
                                }`}
                              >
                                <div style={{ flex: '1', minWidth: '200px' }}>
                                  <InputCT
                                    type="text"
                                    placeholder="Question"
                                    defaultValue={_item.label === 'Question' ? '' : _item.label}
                                    required
                                    nonLabel
                                    setValue={(value) => handleChangeTitleQuestion(index, value)}
                                  />
                                </div>
                                <div style={{ minWidth: '200px' }}>
                                  <SelectOption
                                    options={['Short answer', 'Multiple choice', 'Checkboxes']}
                                    defaultValue={getTypeOptionChange(_item)}
                                    setSelect={handleChangeType}
                                  />
                                </div>
                              </div>
                              <p
                                className={`${classes['createSurvey__list-item-question']} ${
                                  idxActive !== index ? classes['createSurvey__list-item-question--active'] : undefined
                                }`}
                              >
                                <span>{_item.label}</span>
                                {_item.question_detail.required && (
                                  <span className={classes['createSurvey__list-item-question-required']}>*</span>
                                )}
                              </p>

                              {_item.type === 'InputType' && <InputText disabled />}
                              {_item.type === 'SelectType' &&
                                (_item.question_detail.multiselect ? (
                                  <Checkboxes
                                    type="checkbox"
                                    edit={idxActive === index}
                                    disabled={idxActive !== index}
                                    options={[..._item.question_detail.options]}
                                    sequence={_item.sequence}
                                    handleBlur={handleBlurOptions}
                                  />
                                ) : (
                                  <Checkboxes
                                    type="radio"
                                    edit={idxActive === index}
                                    disabled={idxActive !== index}
                                    options={[..._item.question_detail.options]}
                                    sequence={_item.sequence}
                                    handleBlur={handleBlurOptions}
                                  />
                                ))}

                              <div
                                className={`${classes['createSurvey__list-item-footer']} ${
                                  idxActive === index ? classes['createSurvey__list-item-footer--active'] : undefined
                                }`}
                              >
                                <span>Required</span>
                                <ToggleCheckbox
                                  id={+index}
                                  isChecked={_item.question_detail.required}
                                  handleClickRequired={handleClickRequired}
                                />
                              </div>
                            </div>

                            {/* RIGHT */}
                            <div style={{ width: '60px' }}>
                              <div
                                className={`${classes['createSurvey__list-item-right']} ${
                                  idxActive === index ? classes['createSurvey__list-item-right--active'] : undefined
                                }`}
                              >
                                <div onClick={() => handleAddQuestion(index)}>
                                  <FontAwesomeIcon icon={faCirclePlus} fontSize={22} />
                                </div>
                                <div onClick={() => handleCopyQuestion(index)}>
                                  <FontAwesomeIcon icon={faCopy} fontSize={22} />
                                </div>
                                <div onClick={() => handleRemoveQuestion(index)}>
                                  <FontAwesomeIcon icon={faTrashCan} fontSize={22} />
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        <div className={classes.editQuestionnairTool}>
          <ButtonCT opacityBtn medium borderRadius iconLeft={faShare} onClick={handleShare}>
            <strong>Share</strong>
          </ButtonCT>
          <ButtonCT primary medium borderRadius onClick={() => navigate(`/datasets/${data.data.about.slug}`)}>
            <strong>Complete</strong>
          </ButtonCT>
        </div>
      </div>
    </div>
  );
};

export default EditSurvey;
