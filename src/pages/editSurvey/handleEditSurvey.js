import { toast } from 'react-toastify';

export const defaultQuestionDetail = {
  InputType: {
    placeholder: 'Enter your anwser',
    other_field: true,
    required: false,
  },
  CheckboxType: {
    multiselect: true,
    required: false,
    other_field: true,
    options: [{ value: 'Option 1' }],
  },
  RadioType: {
    multiselect: false,
    html_select: true,
    required: false,
    other_field: true,
    options: [{ value: 'Option 1' }],
  },
};

export const typeInputMapping = {
  'Short answer': {
    type: 'InputType',
    inputType: 'InputType',
  },
  'Multiple choice': {
    type: 'SelectType',
    inputType: 'RadioType',
  },
  Checkboxes: {
    type: 'SelectType',
    inputType: 'CheckboxType',
  },
};

export const notifyNotPermission = () => {
  toast.error('This survey has a datasets so it cannot be changed!', {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};
