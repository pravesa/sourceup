import {TextField, TextFieldProps} from '@mui/material';

type FormInputProps = TextFieldProps & {
  name: string;
  value: {
    [k: string]: unknown;
  };
  inputErr?: {
    [k: string]: string;
  };
};

/**
 * Form input component extended from MUI's TextField to support
 * ease of using value and error related fields within a form as whole.
 */

const FormInput = (props: FormInputProps) => {
  const {name, inputErr, value, inputMode, ...otherProps} = props;

  const inputValue = value?.[name];
  const err = inputErr && inputErr?.[name];

  return (
    <TextField
      name={name}
      value={inputValue}
      {...otherProps}
      error={!!err?.length}
      helperText={err}
      inputProps={{inputMode: inputMode}}
    />
  );
};

export default FormInput;
