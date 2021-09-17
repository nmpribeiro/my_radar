// taken from https://gist.github.com/codeguy/6684588
const createSlug = (str: string, separator = '-'): string =>
  str
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, separator);

export const Utilities = { createSlug };
