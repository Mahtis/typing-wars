
export const BACKEND_URL = 'http://localhost:3000'

// Creates an array from to, including to
// To make things confusing, it cuts out negative values
// becuase in this case those are outside the board (i.e. above it)
export const range = (from, to) =>
  Array(to + 1 - from)
    .fill(from)
    .map((fromValue, i) => fromValue + i)
    .filter(value => value >= 0);
