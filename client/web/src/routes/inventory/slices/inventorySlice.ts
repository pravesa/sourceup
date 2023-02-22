import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../redux-hooks';

interface Inventory {
  stocks: Material[];
}

// Initial state of the inventory
const initialState: Inventory = {
  stocks: [],
};

/**
 * A Redux slice for managing the inventory state.
 * @type {import("@reduxjs/toolkit").Slice<Inventory>}
 */
export const inventorySlice: import('@reduxjs/toolkit').Slice<Inventory> =
  createSlice({
    name: 'inventory',
    initialState,
    reducers: {
      setInventory: (_state, action: PayloadAction<Inventory>) => {
        return action.payload;
      },
      createStock: (state, action: PayloadAction<Material>) => {
        state.stocks.push(action.payload);
      },
      editStock: (
        state,
        action: PayloadAction<{idx: number; material: Material}>
      ) => {
        state.stocks[action.payload.idx] = action.payload.material;
      },
      deleteStock: (state, action: PayloadAction<{id: string}>) => {
        state.stocks = state.stocks.filter(
          (stock) => stock.id !== action.payload.id
        );
      },
    },
  });

/**
 * Action creators for the invnentory slice.
 */
export const {setInventory, createStock, editStock, deleteStock} =
  inventorySlice.actions;

/**
 * Selector function for getting the current inventory state.
 * @param {RootState} state - The current Redux state.
 * @returns {Inventory} The inventory state.
 */
export const getInventory = (state: RootState): Inventory => state.inventory;

/**
 * The reducer function for the inventory slice.
 */
export default inventorySlice.reducer;
