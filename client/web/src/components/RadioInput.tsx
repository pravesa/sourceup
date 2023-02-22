import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from '@mui/material';

type RadioInputProps = RadioGroupProps & {
  name: string;
  label: string;
  value?: {
    [k: string]: unknown;
  };
  inputErr?: {
    [k: string]: string;
  };
  options?: {value: string | number; label: string}[];
};

const RadioInput = (props: RadioInputProps) => {
  const {name, label, value, inputErr, options, ...otherProps} = props;

  const err = inputErr && inputErr?.[name];
  const inputValue = value && value?.[name];

  return (
    <FormControl error={!!err?.length}>
      <FormLabel id={label}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name={name}
        value={inputValue}
        {...otherProps}
      >
        {options?.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{err}</FormHelperText>
    </FormControl>
  );
};

export default RadioInput;
