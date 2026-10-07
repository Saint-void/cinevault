export const movies = [
  {
    id: '693134',
    title: 'Dune: Part Two',
    year: 2024,
    genre: 'Sci-Fi',
    rating: 8.5,
    runtime: '2h 46m',
    popularity: 98,
    poster: '1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: '1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Faced with a choice between love and the fate of the universe, he must prevent a terrible future only he can foresee.'
  },
  {
    id: '1022789',
    title: 'Inside Out 2',
    year: 2024,
    genre: 'Animation',
    rating: 7.6,
    runtime: '1h 36m',
    popularity: 95,
    poster: 'vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop: 'stKGOm8UyhuLPR9sZLjs5AkmncA.jpg',
    synopsis: 'A new set of emotions takes over headquarters when Riley enters her teenage years. Joy and the original crew must make room for Anxiety, Envy, Ennui, and Embarrassment.'
  },
  {
    id: '533535',
    title: 'Deadpool & Wolverine',
    year: 2024,
    genre: 'Action',
    rating: 7.7,
    runtime: '2h 8m',
    popularity: 93,
    poster: '8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    synopsis: 'A listless Wade Wilson is pulled back into action when the Time Variance Authority recruits him for a mission that could change the multiverse, with an unlikely partner in tow.'
  },
  {
    id: '792307',
    title: 'Poor Things',
    year: 2023,
    genre: 'Drama',
    rating: 7.8,
    runtime: '2h 21m',
    popularity: 87,
    poster: 'kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    backdrop: 'kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    synopsis: 'The incredible tale and fantastical evolution of Bella Baxter, a young woman brought back to life by an unorthodox scientist, as she sets off on an adventure of self-discovery.'
  },
  {
    id: '666277',
    title: 'Past Lives',
    year: 2023,
    genre: 'Romance',
    rating: 7.9,
    runtime: '1h 46m',
    popularity: 81,
    poster: 'k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
    backdrop: 'y2Aimt8isimtigec3e4kB2G9FMR.jpg',
    synopsis: 'Two deeply connected childhood friends are separated after one family emigrates from South Korea. Decades later, they reunite in New York and reckon with the lives they chose.'
  },
  {
    id: '414906',
    title: 'The Batman',
    year: 2022,
    genre: 'Thriller',
    rating: 7.7,
    runtime: '2h 56m',
    popularity: 79,
    poster: '74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop: 'b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    synopsis: 'When a killer leaves a trail of cryptic clues, Batman investigates the corruption in Gotham and follows a path that brings him closer to the city’s darkest secrets.'
  },
  {
    id: '545611',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    genre: 'Sci-Fi',
    rating: 7.8,
    runtime: '2h 20m',
    popularity: 76,
    poster: 'w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    backdrop: 'ss0Os3uWJfIPodx8SxYp8E8BE7D.jpg',
    synopsis: 'An exhausted laundromat owner is swept into an astonishing adventure where she alone can save the world by exploring the lives she could have lived across the multiverse.'
  },
  {
    id: '569094',
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    genre: 'Animation',
    rating: 8.4,
    runtime: '2h 20m',
    popularity: 74,
    poster: '8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: '4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    synopsis: 'Miles Morales reunites with Gwen Stacy and is catapulted across the multiverse, where he meets a team of Spider-People charged with protecting its existence.'
  }
];

export const imageUrl = (path, size = 'w500') => `https://image.tmdb.org/t/p/${size}/${path}`;

export function getMovie(id) {
  return movies.find((movie) => movie.id === String(id));
}