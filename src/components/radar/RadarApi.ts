export interface Data {
  circle: number;
  quadrant: number;
  text: string;
}
export interface Dot extends Data {
  x: number | null;
  xValue: number;
  y: number | null;
  yValue: number;
  fillColor: string;
}

export class RadarApi {
  static cleanData = (data: Data[]): Dot[] =>
    data.reduce((list: Dot[], element: Data) => {
      // const entry: Dot = {
      //   x: null,
      //   y: null,
      //   text: element.text,
      //   quadrant: element.quadrant,
      //   fillColor: ['green', 'blue', 'red', 'orange'][element.quadrant - 1],
      // };

      // let dot: Dot;
      // do {
      //   dot = RadarApi.calculateDot(element, x, y);
      //   // calculate this exact dot new until it has a distance to every other dot that is longer than 28 (2x dot radius)
      // } while (list.some((item) => RadarApi.checkDistanceBetweenDots(dot.xValue, item.x, dot.yValue, item.y) < 20));

      // entry.x = dot.xValue;
      // entry.y = dot.yValue;

      // list.push(entry);

      return list;
    }, []);

  /**
   * Private methods
   */
  private static calculateDot = (element: Data, x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>) => {
    // radian between 5 and 85
    const randomDegree = ((Math.random() * 80 + 5) * Math.PI) / 180;
    const circle = element.circle - 0.2;
    const r = Math.random() * 0.6 + (circle - 0.6);
    // multiples of PI/2
    // loops through every quadrant starting from top left, bottom left, bottom right, top right
    const shift = (Math.PI * [1, 4, 3, 2][element.quadrant - 1]) / 2;

    return {
      xValue: x(Math.cos(randomDegree + shift) * r),
      yValue: y(Math.sin(randomDegree + shift) * r),
    };
  };

  private static checkDistanceBetweenDots = (x1: number, x2: number, y1: number, y2: number) => {
    const a = x2 - x1;
    const b = y2 - y1;
    return Math.sqrt(a * a + b * b);
  };
}
