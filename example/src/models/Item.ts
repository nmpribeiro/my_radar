// TODO
type BaseCSVType = { [key: string]: string };

export interface SuperRawBlipType extends BaseCSVType {
  'Country of Implementation': string;
  Data: string;
  'Date of Implementation': string;
  Description: string;
  'Disaster Cycle': string;
  'Ideas/Concepts/Examples': string;
  SDG: string;
  Source: string;
  'Status/Maturity': string;
  'Supporting Partners': string;
  Technology: string;
  'Un Host Organisation': string;
  'Use Case': string;
}

export interface RawBlipType {
  'Country of Implementation': string;
  Data: string;
  'Date of Implementation': string;
  Description: string;
  'Disaster Cycle': string;
  'Ideas/Concepts/Examples': string;
  SDG: string[];
  Source: string;
  'Status/Maturity': string;
  'Supporting Partners': string;
  Technology: string[];
  'Un Host Organisation': string;
  'Use Case': string;
}
