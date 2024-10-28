import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeroList from "./HeroList";
import { fetchHeroes } from "../../utils/api";

jest.mock("../../utils/api");

const mockedFetchHeroes = fetchHeroes as jest.MockedFunction<typeof fetchHeroes>;

describe("HeroList component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<HeroList />);
    expect(screen.getByText(/Star Wars Heroes/i)).toBeInTheDocument();
  });

  it("displays loading indicator while fetching heroes", async () => {
    mockedFetchHeroes.mockResolvedValueOnce({ results: [], next: null });
    render(<HeroList />);

    expect(screen.getByText(/Loading more heroes.../i)).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText(/Loading more heroes.../i)).not.toBeInTheDocument());
  });

  it("displays error message if fetching heroes fails", async () => {
    mockedFetchHeroes.mockRejectedValueOnce(new Error("Failed to load heroes."));
    render(<HeroList />);

    expect( await screen.findByText(/Failed to load heroes/i)).toBeInTheDocument();
  });

  it("fetches and displays a list of heroes", async () => {
    const heroesMock = [
      { id: 1, name: "Luke Skywalker" },
      { id: 2, name: "Darth Vader" },
    ];
    mockedFetchHeroes.mockResolvedValueOnce({ results: heroesMock, next: "next-page-url" });

    render(<HeroList />);

    for (const hero of heroesMock) {
      expect( await screen.findByText(hero.name)).toBeInTheDocument();
    }
  });

  it("loads more heroes on scroll", async () => {
    const heroesPage1 = [
      { id: 1, name: "Luke Skywalker" },
      { id: 2, name: "Darth Vader" },
    ];
    const heroesPage2 = [
      { id: 3, name: "Leia Organa" },
      { id: 4, name: "Yoda" },
    ];

    mockedFetchHeroes
      .mockResolvedValueOnce({ results: heroesPage1, next: "next-page-url" })
      .mockResolvedValueOnce({ results: heroesPage2, next: null });

    render(<HeroList />);

    for (const hero of heroesPage1) {
      expect( await screen.findByText(hero.name)).toBeInTheDocument();
    }

    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    for (const hero of heroesPage2) {
      expect(await screen.findByText(hero.name)).toBeInTheDocument();
    }
  });
});
