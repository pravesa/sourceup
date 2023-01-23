import {AlertColor, TextFieldProps} from '@mui/material';

/**
 * Form field properties.
 */
export type FieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  inputMode?: TextFieldProps['inputMode'];
  select?: boolean;
  options?: {value: string | number; label: string}[];
};

/**
 * Field properties associated with validation purpose.
 */
export type FormProps = {
  values: {[n: string]: string | number | boolean};
  errors: {[k: string]: string};
  onValueChange: (
    el: HTMLInputElement | HTMLTextAreaElement,
    optional?: {[k: string]: string | number | boolean},
    deps?: string[]
  ) => void;
};

/**
 * Properties for single step form.
 */
export type StepProps = {
  label: string;
  completed?: boolean;
  optional?: boolean;
  error?: {
    count?: number;
    code?: number;
  };
};

/**
 * Step form fField properties associated with validation purpose.
 */
export type StepFormProps = Pick<FormProps, 'onValueChange'> & {
  values: {[k: number]: FormProps['values']};
  errors: {[k: number]: FormProps['errors']};
};

/**
 * Server response type
 */
export type ServerResponse = {
  payload?: {
    _id?: string;
    uname?: string;
    org?: Array<string>;
    pref?: {
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  status: number;
  statusText: string;
  message: string;
};

/**
 * Response content type for AlertDialog component
 */
export type ResponseAlert = Omit<ServerResponse, 'payload'> & {
  severity: AlertColor;
};
