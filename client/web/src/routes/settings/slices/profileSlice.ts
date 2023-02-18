import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../redux-hooks';

interface Profile {
  name: string;
  mail: {
    sec: string;
  };
  regd?: Address;
  plant: {
    [k: string]: Address;
  };
}

// Initial state of the profile
const initialState: Profile = {
  name: '',
  mail: {
    sec: '',
  },
  regd: undefined,
  plant: {},
};

/**
 * A Redux slice for managing the user profile state.
 * @type {import("@reduxjs/toolkit").Slice<Profile>}
 */
export const profileSlice: import('@reduxjs/toolkit').Slice<Profile> =
  createSlice({
    name: 'profile',
    initialState,
    reducers: {
      /**
       * Sets the user's general information.
       */
      setGeneral: (
        state,
        action: PayloadAction<{name: string; mail: {sec: string}}>
      ) => {
        state.name = action.payload.name;
        state.mail.sec = action.payload.mail.sec;
      },
      /**
       * Sets the user's registered address.
       */
      setRegdAddress: (state, action: PayloadAction<Address>) => {
        state.regd = {...action.payload};
      },
      /**
       * Sets the user's plant address for a specific plant ID.
       */
      setPlantAddress: (
        state,
        action: PayloadAction<{id: string; address: Address}>
      ) => {
        state.plant[action.payload.id] = action.payload.address;
      },
    },
  });

/**
 * Action creators for the profile slice.
 */
export const {setGeneral, setRegdAddress, setPlantAddress} =
  profileSlice.actions;

/**
 * Selector function for getting the current user profile state.
 * @param {RootState} state - The current Redux state.
 * @returns {Profile} The user profile state.
 */
export const getProfile = (state: RootState): Profile => state.profile;

/**
 * The reducer function for the profile slice.
 */
export default profileSlice.reducer;
