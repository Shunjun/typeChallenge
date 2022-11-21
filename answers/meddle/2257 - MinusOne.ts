/*
  2257 - MinusOne
  -------
  by Mustafo Faiz (@fayzzzm) #medium #math
  
  ### Question
  
  Given a number (always positive) as a type. Your type should return the number decreased by one.
  
  For example:
  
  ```ts
  type Zero = MinusOne<1> // 0
  type FiftyFour = MinusOne<55> // 54
  ```
  
  > View on GitHub: https://tsch.js.org/2257
*/

/* _____________ Your Code Here _____________ */

interface Defer<T> {
  next: T;
  value: unknown;
}

interface Result<T> extends Defer<Result<T>> {
  value: T;
}

type Next<T> = T[Extract<"next", keyof T>];

type GetNext_10Times<T> = Next<T> extends infer T
  ? Next<T> extends infer T
    ? Next<T> extends infer T
      ? Next<T> extends infer T
        ? Next<T> extends infer T
          ? Next<T> extends infer T
            ? Next<T> extends infer T
              ? Next<T> extends infer T
                ? Next<T> extends infer T
                  ? Next<T>
                  : never
                : never
              : never
            : never
          : never
        : never
      : never
    : never
  : never;

type GetNext_100Times<T> = GetNext_10Times<T> extends infer T
  ? GetNext_10Times<T> extends infer T
    ? GetNext_10Times<T> extends infer T
      ? GetNext_10Times<T> extends infer T
        ? GetNext_10Times<T> extends infer T
          ? GetNext_10Times<T> extends infer T
            ? GetNext_10Times<T> extends infer T
              ? GetNext_10Times<T> extends infer T
                ? GetNext_10Times<T> extends infer T
                  ? GetNext_10Times<T>
                  : never
                : never
              : never
            : never
          : never
        : never
      : never
    : never
  : never;

type GetNext_1000Times<T> = GetNext_100Times<T> extends infer T
  ? GetNext_100Times<T> extends infer T
    ? GetNext_100Times<T> extends infer T
      ? GetNext_100Times<T> extends infer T
        ? GetNext_100Times<T> extends infer T
          ? GetNext_100Times<T> extends infer T
            ? GetNext_100Times<T> extends infer T
              ? GetNext_100Times<T> extends infer T
                ? GetNext_100Times<T> extends infer T
                  ? GetNext_100Times<T>
                  : never
                : never
              : never
            : never
          : never
        : never
      : never
    : never
  : never;

type GetNext_2000Times<T> = GetNext_1000Times<T> extends infer T
  ? GetNext_1000Times<T>
  : never;

type ArrayOfLength<N extends number, RES extends 1[] = []> = Defer<
  [...RES, 1]["length"] extends N
    ? Result<RES["length"]>
    : ArrayOfLength<N, [...RES, 1]>
>;

type MinusOne<N extends number> = GetNext_2000Times<ArrayOfLength<N>>["value"];

type tt = MinusOne<1>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  // 最大支持 2000
  Expect<Equal<MinusOne<2000>, 1999>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2257/answer
  > View solutions: https://tsch.js.org/2257/solutions
  > More Challenges: https://tsch.js.org
*/
