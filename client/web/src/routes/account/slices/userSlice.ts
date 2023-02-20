import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../redux-hooks';

// Initial state of the user
const initialState: User = {
  _id: '',
  gstn: '',
  name: '',
  mail: {
    pri: '',
  },
  regd: undefined,
  head: undefined,
  plant: {},
  warehouse: {},
  isHeadSameAsRegd: false,
};

/**
 * A Redux slice for managing the user user state.
 * @type {import("@reduxjs/toolkit").Slice<User>}
 */
export const userSlice: import('@reduxjs/toolkit').Slice<User> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetUser: (_state, _action) => {
      return initialState;
    },
    /**
     * Sets the user.
     */
    setUser: (state, action: PayloadAction<User>) => {
      return {...state, ...action.payload};
    },
    /**
     * Sets the user's general information.
     */
    setGeneral: (
      state,
      action: PayloadAction<{name: string; mail: string}>
    ) => {
      state.name = action.payload.name;
      // state.mail.sec = action.payload.mail;
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
 * Action creators for the user slice.
 */
export const {
  resetUser,
  setUser,
  setGeneral,
  setRegdAddress,
  setIsHeadSameAsRegd,
  setHeadAddress,
  setPlantAddress,
  deletePlantAddress,
  setWarehouseAddress,
  deleteWarehouseAddress,
} = userSlice.actions;

/**
 * Selector function for getting the current user user state.
 * @param {RootState} state - The current Redux state.
 * @returns {User} The user user state.
 */
export const getUser = (state: RootState): User => state.user;

/**
 * The reducer function for the user slice.
 */
export default userSlice.reducer;
