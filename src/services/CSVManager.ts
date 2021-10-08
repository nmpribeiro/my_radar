/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-plusplus */
import { RequestBuilder } from 'react-rb-auth';
// USDAGE:

export const getCSVFileFromUrl = async (url: string): Promise<string> => new RequestBuilder(url).build<string>();

export class CSVManager {
  content: string;

  new_line_char = '\n';

  field_separator_char = ',';

  constructor(file: string) {
    this.content = file;
  }

  public processCSV = <T extends BaseCSVType>(delim = ','): T[] => {
    this.field_separator_char = delim;

    const result: T[] = [];
    const headers: string[] = [];
    const rawObjects = this.processRawData();
    rawObjects.forEach((v, i) => {
      if (i === 0) {
        v.forEach((h) => headers.push(h.trim()));
      } else {
        // actual objects
        const newItem: Record<string, string> = {};
        v.forEach((value, j) => {
          const header = headers[j];
          newItem[header] = value.trim();
        });
        result.push(newItem as T);
      }
    });
    return result;
  };

  processRawData(): string[][] {
    let csv_str = this.content;
    let result: string[][] = [];

    let line_end_index_moved = false;
    let line_start_index = 0;
    let line_end_index = 0;
    let csr_index = 0;
    let cursor_val = csv_str[csr_index];
    const found_new_line_char = CSVManager.get_new_line_char(csv_str);
    let in_quote = false;

    // Handle

    if (found_new_line_char === '\n') {
      csv_str = csv_str.split(found_new_line_char).join(this.new_line_char);
    }
    // Handle the last character is not

    if (csv_str[csv_str.length - 1] !== this.new_line_char) {
      csv_str += this.new_line_char;
    }

    while (csr_index < csv_str.length) {
      if (cursor_val === '"') {
        in_quote = !in_quote;
      } else if (cursor_val === this.new_line_char) {
        if (in_quote === false) {
          if (line_end_index_moved && line_start_index <= line_end_index) {
            result.push(this.parse_csv_line(csv_str.substring(line_start_index, line_end_index)));
            line_start_index = csr_index + 1;
          } // Else: just ignore line_end_index has not moved or line has not been sliced for parsing the line
        } // Else: just ignore because we are in a quote
      }
      csr_index++;
      cursor_val = csv_str[csr_index];
      line_end_index = csr_index;
      line_end_index_moved = true;
    }

    // Handle

    if (found_new_line_char === '\n') {
      const new_result = [];
      let curr_row;
      for (let i = 0; i < result.length; i++) {
        curr_row = [];
        for (let j = 0; j < result[i].length; j++) {
          curr_row.push(result[i][j].split(this.new_line_char).join('\n'));
        }
        new_result.push(curr_row);
      }
      result = new_result;
    }
    return result;
  }

  parse_csv_line(csv_line_str_arg: string): string[] {
    let csv_line_str = csv_line_str_arg;
    const result = [];

    // let field_end_index_moved = false;
    let field_start_index = 0;
    let field_end_index = 0;
    let csr_index = 0;
    let cursor_val = csv_line_str[csr_index];
    let in_quote = false;

    // Pretend that the last char is the separator_char to complete the loop
    csv_line_str += this.field_separator_char;

    while (csr_index < csv_line_str.length) {
      if (cursor_val === '"') {
        in_quote = !in_quote;
      } else if (cursor_val === this.field_separator_char) {
        if (in_quote === false) {
          if (field_start_index <= field_end_index) {
            result.push(CSVManager.parse_csv_field(csv_line_str.substring(field_start_index, field_end_index)));
            field_start_index = csr_index + 1;
          } // Else: just ignore field_end_index has not moved or field has not been sliced for parsing the field
        } // Else: just ignore because we are in quote
      }
      csr_index++;
      cursor_val = csv_line_str[csr_index];
      field_end_index = csr_index;
      // field_end_index_moved = true;
    }
    return result;
  }

  static parse_csv_field(csv_field_str_arg: string): string {
    let csv_field_str = csv_field_str_arg;
    const with_quote = csv_field_str[0] === '"';

    if (with_quote) {
      csv_field_str = csv_field_str.substring(1, csv_field_str.length - 1); // remove the start and end quotes
      csv_field_str = csv_field_str.split('""').join('"'); // handle double quotes
    }
    return csv_field_str.replace(/^\s+|\s+$/g, '');
  }

  static get_new_line_char(csv_str: string): string {
    if (csv_str.indexOf('\n') > -1) {
      return '\n';
    }
    return '\n';
  }

  static parseLine(line: string): string[] {
    if (line.indexOf('"') < 0) return line.split(',');

    const result: string[] = [];
    let cell = '';
    let quote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        cell += char;
        i++;
      } else if (char === '"') {
        quote = !quote;
      } else if (!quote && char === ',') {
        result.push(cell as string);
        cell = '';
      } else {
        cell += char;
      }
      if (i === line.length - 1 && cell) {
        result.push(cell as string);
      }
    }
    return result;
  }
}
