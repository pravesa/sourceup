import {startTransition, useState} from 'react';
import {BaseSchema, reach} from 'yup';
import {FormProps, StepFormProps, StepProps} from '../../types';

/**
 * A custom validator hook for step forms which performs validation on passed values with yup validation schema.
 *
 * @param initialSteps Object specifying initial state of the steps.
 * @param initialValues Object specifying initial values of all the steps.
 * @param activeStep Pass the current active step to validate on that particular step.
 * @param validationSchema Yup nested Object schema to be used for validation.
 * @param hasSteps @default true if false, simple yup object schema will be used for validation. It is coupled with `useValidate`.
 * @returns array of values and helpher functions.
 */

const useStepValidate = (
  initialSteps: StepProps[],
  initialValues: StepFormProps['values'],
  activeStep: number,
  validationSchema: BaseSchema,
  hasSteps = true
): [
  StepProps[],
  StepFormProps['values'],
  StepFormProps['errors'],
  StepFormProps['onValueChange'],
  (resetValues?: StepFormProps['values']) => void
] => {
  const [steps, setSteps] = useState(initialSteps);
  const [values, setValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<StepFormProps['errors']>({});

  /**
   * This function accepts any input element and it's value will be validated against the validation schema.
   *
   * @param el Input element for which the value will be validated.
   * @param depElemVal Set value for any element manually when it is dependent on current input element (el) passed.
   * @param deps Array of input element that will be checked for any errors and accounted in the total error count if any.
   */
  const handleValue = (
    el: HTMLInputElement | HTMLTextAreaElement,
    depElemVal?: {[k: string]: string | number | boolean},
    deps?: string[]
  ) => {
    const name = el.name || el.id;
    const {value} = el;

    const newValueObj = {
      ...values[activeStep],
      [name]: value,
      ...depElemVal,
    };
    setValues((prevState) => {
      const updatedState = {...prevState, [activeStep]: {...newValueObj}};
      return updatedState;
    });

    startTransition(() => {
      //   const context = {
      //     context: { type: newValueObj["type"] ?? values["type"] },
      //   };
      let error = {...formErrors[activeStep]};
      const allError: FormProps['errors'] = {};
      const updatedStep = {...steps[activeStep]};

      const schema: BaseSchema = hasSteps
        ? reach(validationSchema, `step${activeStep}`)
        : validationSchema;

      schema
        .validate(newValueObj, {/* ...context, */ abortEarly: false})
        .then(() => {
          error = {};
          updatedStep.error = undefined;
          updatedStep.completed = true;
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          err.inner.forEach((e: any) => {
            allError[e.path] = e.message;
          });

          error[name] = allError[name];

          const setError = (path: string) => {
            if (allError[path] !== undefined) {
              error[path] = allError[path];
            } else {
              delete error?.[path];
            }
          };

          for (const path in error) {
            if (Object.prototype.hasOwnProperty.call(error, path)) {
              setError(path);
            }
          }

          deps?.forEach((path: string) => {
            setError(path);
          });

          updatedStep.completed = false;
          updatedStep.error = {count: Object.keys(error).length};
        })
        .finally(() => {
          setFormErrors({...formErrors, [activeStep]: {...error}});
          setSteps((prevState) => {
            const state = prevState.slice();
            state[activeStep] = updatedStep;
            return state;
          });
        });
    });
  };

  /**
   * Calling this function will resets all the current state except for values with resetValues if provided.
   */

  const handleReset = (resetValues?: StepFormProps['values']) => {
    setValues(resetValues ?? initialValues);
    setFormErrors({});
    setSteps(initialSteps);
  };

  return [steps, values, formErrors, handleValue, handleReset];
};

export default useStepValidate;
