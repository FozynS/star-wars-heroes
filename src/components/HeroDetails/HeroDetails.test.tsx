import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import HeroDetails from "./HeroDetails";
import { fetchHeroDetails, fetchFilms, fetchStarships } from "../../utils/api";
import HeroGraph from "../HeroGraph/HeroGraph";

// Мокаем функции API
jest.mock("../../utils/api");
jest.mock("../HeroGraph/HeroGraph", () => jest.fn(() => <div data-testid="hero-graph" />));

const mockedFetchHeroDetails = fetchHeroDetails as jest.MockedFunction<typeof fetchHeroDetails>;
const mockedFetchFilms = fetchFilms as jest.MockedFunction<typeof fetchFilms>;
const mockedFetchStarships = fetchStarships as jest.MockedFunction<typeof fetchStarships>;

describe("HeroDetails component", () => {
  const heroMock = {
    id: 1,
    name: "Luke Skywalker",
    films: ["film1", "film2"],
    starships: ["starship1", "starship2"],
  };
  const filmsMock = [{ title: "A New Hope" }, { title: "The Empire Strikes Back" }];
  const starshipsMock = [{ name: "X-wing" }, { name: "Millennium Falcon" }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading indicator initially", () => {
    // Мокаем пустое разрешение промисов
    mockedFetchHeroDetails.mockResolvedValueOnce(heroMock);
    mockedFetchFilms.mockResolvedValueOnce(filmsMock);
    mockedFetchStarships.mockResolvedValueOnce(starshipsMock);

    render(
      <MemoryRouter initialEntries={["/hero/1"]}>
        <Routes>
          <Route path="/hero/:heroId" element={<HeroDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("fetches and displays hero details", async () => {
    mockedFetchHeroDetails.mockResolvedValueOnce(heroMock);
    mockedFetchFilms.mockResolvedValueOnce(filmsMock);
    mockedFetchStarships.mockResolvedValueOnce(starshipsMock);

    render(
      <MemoryRouter initialEntries={["/hero/1"]}>
        <Routes>
          <Route path="/hero/:heroId" element={<HeroDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(heroMock.name)).toBeInTheDocument();
    expect(screen.getByText("Back to List")).toBeInTheDocument();
  });

  it("renders HeroGraph with correct props", async () => {
    mockedFetchHeroDetails.mockResolvedValueOnce(heroMock);
    mockedFetchFilms.mockResolvedValueOnce(filmsMock);
    mockedFetchStarships.mockResolvedValueOnce(starshipsMock);

    render(
      <MemoryRouter initialEntries={["/hero/1"]}>
        <Routes>
          <Route path="/hero/:heroId" element={<HeroDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("hero-graph")).toBeInTheDocument();

    // Проверяем, что HeroGraph был вызван с правильными пропсами
    expect(HeroGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        hero: heroMock,
        films: filmsMock,
        starships: starshipsMock,
      }),
      {}
    );
  });

  it("displays error message if fetching hero details fails", async () => {
    mockedFetchHeroDetails.mockRejectedValueOnce(new Error("Failed to fetch hero details"));

    render(
      <MemoryRouter initialEntries={["/hero/1"]}>
        <Routes>
          <Route path="/hero/:heroId" element={<HeroDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed to load hero details/i)).toBeInTheDocument();
  });
});
