import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../redux-hooks';

interface Quotation {
  requirements: Requirements[];
  quotations: Quotations;
}

// Initial state of the Quotation
const initialState: Quotation = {
  requirements: [],
  quotations: {},
};

/**
 * A Redux slice for managing the Quotation state.
 * @type {import("@reduxjs/toolkit").Slice<Quotation>}
 */
export const quotationSlice: import('@reduxjs/toolkit').Slice<Quotation> =
  createSlice({
    name: 'quotation',
    initialState,
    reducers: {
      setRequirements: (
        state,
        action: PayloadAction<{requirements: Quotation['requirements']}>
      ) => {
        state.requirements = action.payload.requirements ?? [];
      },
      setQuotation: (
        state,
        action: PayloadAction<{quotations: Quotation['quotations']}>
      ) => {
        state.quotations = action.payload.quotations ?? {};
      },
      updateQuotation: (
        state,
        action: PayloadAction<{
          companyName: string;
          item: string;
          quote: {quotedAt: Date; rate: number};
        }>
      ) => {
        const {companyName, item, quote} = action.payload;
        if (!state.quotations?.[companyName]?.[item]) {
          if (!state.quotations?.[companyName]) {
            state.quotations = {
              ...state.quotations,
              [companyName]: {},
            };
          }
          state.quotations[companyName] = {
            ...state.quotations[companyName],
            [item]: [],
          };
        }
        state.quotations[companyName][item].push(quote);
      },
    },
  });

/**
 * Action creators for the invnentory slice.
 */
export const {setRequirements, setQuotation, updateQuotation} =
  quotationSlice.actions;

/**
 * Selector function for getting the current Quotation state.
 * @param {RootState} state - The current Redux state.
 * @returns {Quotation} The Quotation state.
 */
export const getQuotation = (state: RootState): Quotation => state.quotation;

/**
 * The reducer function for the Quotation slice.
 */
export default quotationSlice.reducer;
