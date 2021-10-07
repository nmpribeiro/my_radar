import { TECH_KEY } from '../constants/RadarData';

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

const cleanRawBlips = (rawBlips: SuperRawBlipType[]): RawBlipType[] => {
  const result: RawBlipType[] = [];
  rawBlips.forEach((item) => {
    const SDG: string[] = item.SDG.split(',');
    const Technology: string[] = item.Technology.split(',');
    const newItem: RawBlipType = {
      'Country of Implementation': item['Country of Implementation'],
      Data: item.Data,
      'Date of Implementation': item['Date of Implementation'],
      Description: item.Description,
      'Disaster Cycle': item['Disaster Cycle'],
      'Ideas/Concepts/Examples': item['Ideas/Concepts/Examples'],
      Source: item.Source,
      'Status/Maturity': item['Status/Maturity'],
      'Supporting Partners': item['Supporting Partners'],
      'Un Host Organisation': item['Un Host Organisation'],
      'Use Case': item['Use Case'],
      SDG,
      Technology,
    };
    result.push(newItem);
  });
  return result;
};

const checkItemHasTech = (item: BlipType, tech: string): boolean => {
  // check if techFilter was selected
  const sluggedTechs: string[] = [];
  const itemTechs: string[] = item[TECH_KEY] as string[];
  itemTechs.forEach((t) => sluggedTechs.push(createSlug(t)));
  return sluggedTechs.includes(tech);
};

export const Utilities = {
  createSlug,
  cleanRawBlips,
  checkItemHasTech,
};
