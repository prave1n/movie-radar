import { setupTestStore } from "./store/store";
import { Provider } from "react-redux";
import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';

export function renderWithRedux(
    ui,
    { initialState, store = setupTestStore().store } = {}
  ) {
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  }
