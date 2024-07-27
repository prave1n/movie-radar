import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import ActivityList from "../ActivityList";

const mockStore = configureMockStore([]);

describe("ActivityList", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        friendList: ["friend1", "friend2"],
      },
    });
  });

  test("renders ActivityList with initial empty state", () => {
    render(
      <Provider store={store}>
        <ActivityList />
      </Provider>
    );

    expect(screen.getByText(/No recent activities found/i)).toBeInTheDocument();
  });

  test("fetches and displays the activity list", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            list: ["Activity 1", "Activity 2", "Activity 3"],
          }),
      })
    );

    render(
      <Provider store={store}>
        <ActivityList />
      </Provider>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const cards = await screen.findAllByRole("article"); // Card elements use <div role="article">
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent("Activity 1");
    expect(cards[1]).toHaveTextContent("Activity 2");
    expect(cards[2]).toHaveTextContent("Activity 3");
  });

  test("handles fetch error", async () => {
    global.fetch = jest.fn(() => Promise.reject("API is down"));

    render(
      <Provider store={store}>
        <ActivityList />
      </Provider>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText("No recent activities found")).toBeInTheDocument();
  });
});
