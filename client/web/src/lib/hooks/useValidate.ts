import {BaseSchema} from 'yup';
import {FormProps, StepProps} from '../../types';
import useStepValidate from './useStepValidate';

// Form completed state is set to false initially, which can be utilized for toggles other states.
const initialSteps: StepProps[] = [{label: 'Simple Form', completed: false}];

/**
 * A custom form validator hook which performs validation on passed values with yup validation schema.
 *
 * @param initialValues Object specifying initial values.
 * @param schema Yup Object schema to be used for validation.
 * @returns array of values and helpher functions.
 */

const useValidate = (
  initialValues: FormProps['values'],
  schema: BaseSchema
): [
  FormProps['values'],
  FormProps['errors'],
  FormProps['onValueChange'],
  (resetValues?: FormProps['values']) => void,
  StepProps
] => {
  const [steps, values, formErrors, handleValue, handleStepReset] =
    useStepValidate(initialSteps, {[0]: initialValues}, 0, schema, false);

  const handleReset = (resetValues?: FormProps['values']) =>
    handleStepReset(resetValues && {0: resetValues});

  return [values[0], formErrors[0], handleValue, handleReset, steps[0]];
};

export default useValidate;
