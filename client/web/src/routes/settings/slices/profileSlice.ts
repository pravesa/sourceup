import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../redux-hooks';

interface Profile {
  name: string;
  mail: {
    sec: string;
  };
  regd?: Address;
  head?: Address;
  plant: {
    [k: string]: Address;
  };
  warehouse: {
    [k: string]: Address;
  };
  isHeadSameAsRegd: boolean;
}

// Initial state of the profile
const initialState: Profile = {
  name: '',
  mail: {
    sec: '',
  },
  regd: undefined,
  head: undefined,
  plant: {},
  warehouse: {},
  isHeadSameAsRegd: false,
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
       * Sets the user profile.
       */
      setProfile: (_state, action: PayloadAction<Profile>) => {
        return action.payload;
      },
      /**
       * Sets the user's general information.
       */
      setGeneral: (
        state,
        action: PayloadAction<{name: string; mail: string}>
      ) => {
        state.name = action.payload.name;
        state.mail.sec = action.payload.mail;
      },
      /**
       * Sets the user's registered address.
       */
      setRegdAddress: (state, action: PayloadAction<Address>) => {
        state.regd = {...action.payload};
        if (state.isHeadSameAsRegd) {
          state.head = action.payload;
        }
      },
      setIsHeadSameAsRegd: (state, action: PayloadAction<boolean>) => {
        state.isHeadSameAsRegd = action.payload;
        if (action.payload) {
          state.head = state.regd;
        } else {
          state.head = undefined;
        }
      },
      /**
       * Sets the user's Head office address.
       */
      setHeadAddress: (state, action: PayloadAction<Address>) => {
        state.head = action.payload;
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
      /**
       * Deletes the user's plant address for a specific plant ID.
       */
      deletePlantAddress: (state, action: PayloadAction<string>) => {
        delete state.plant[action.payload];
      },
      /**
       * Sets the user's warehouse address with an unique ID.
       */
      setWarehouseAddress: (
        state,
        action: PayloadAction<{id: string; address: Address}>
      ) => {
        state.warehouse[action.payload.id] = action.payload.address;
      },
      /**
       * Deletes the user's warehouse address for a specific ID.
       */
      deleteWarehouseAddress: (state, action: PayloadAction<string>) => {
        delete state.warehouse[action.payload];
      },
    },
  });

/**
 * Action creators for the profile slice.
 */
export const {
  setProfile,
  setGeneral,
  setRegdAddress,
  setIsHeadSameAsRegd,
  setHeadAddress,
  setPlantAddress,
  deletePlantAddress,
  setWarehouseAddress,
  deleteWarehouseAddress,
} = profileSlice.actions;

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
