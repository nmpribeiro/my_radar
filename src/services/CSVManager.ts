import { RequestBuilder } from 'react-rb-auth';
// USDAGE:

export const getCSVFileFromUrl = async (url: string): Promise<string> => new RequestBuilder(url).build<string>();

export class CSVManager {
  content: string;

  constructor(file: string) {
    this.content = file;
  }

  public processCSV = <T extends BaseCSVType>(delim = ','): T[] => {
    const str = this.content;
    const docRows = str.split('\n');
    const headerRow = docRows[0];
    const rows = docRows.slice(1, docRows.length).filter((row) => row !== '');
    const headers = headerRow.split(delim);

    const newArray: T[] = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj: Record<string, string>, header, i) => {
        const newObj = { ...obj } as T;
        if (header && values[i]) newObj[header as keyof T] = values[i] as T[typeof header];
        return newObj;
      }, {});
      return eachObject as T;
    });
    return newArray;
  };
}
