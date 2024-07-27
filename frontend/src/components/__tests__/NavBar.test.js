import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import NavBar from "../NavBar";
import { clearuser } from "../../store/userSlice";

describe("NavBar Component", () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    store = configureStore()({});
    store.dispatch = mockDispatch;

    const localStorageMock = {
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    render(
      <Provider store={store}>
        <Router>
          <NavBar />
        </Router>
      </Provider>
    );
  });

  test("renders Navbar with links", () => {
    expect(screen.getByText(/MovieRadar/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Playlist/i)).toBeInTheDocument();
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/Friends List/i)).toBeInTheDocument();
  });

  test("logout button calls dispatch and clears local storage", () => {
    const logoutButton = screen.getByRole("button", { name: /Log Out/i });
    fireEvent.click(logoutButton);

    // Check if dispatch was called
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(clearuser());

    // Check if local storage items are removed
    expect(localStorage.removeItem).toHaveBeenNthCalledWith(1, "persist:root");
    expect(localStorage.removeItem).toHaveBeenNthCalledWith(2, "token");
  });
});
