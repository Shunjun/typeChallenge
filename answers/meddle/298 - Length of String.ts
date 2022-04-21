/*
  298 - Length of String
  -------
  by Pig Fang (@g-plane) #medium #template-literal
  
  ### Question
  
  Compute the length of a string literal, which behaves like `String#length`.
  
  > View on GitHub: https://tsch.js.org/298
*/

/* _____________ Your Code Here _____________ */

// type 生成数组<
//   填充数字 extends number,
//   数组长度,
//   已有数组 extends number[]
// > = 已有数组["length"] extends 数组长度
//   ? 已有数组
//   : 生成数组<填充数字, 数组长度, [填充数字, ...已有数组]>;

type CreatArray<
  N extends number,
  Arr extends any[] = []
> = Arr["length"] extends N ? Arr : CreatArray<N, [N, ...Arr]>;

type Sum<N extends number, M extends number> = [
  ...CreatArray<N>,
  ...CreatArray<M>
]["length"] extends number
  ? [...CreatArray<N>, ...CreatArray<M>]["length"]
  : never;

type LengthOfString<
  S extends string,
  L extends number = 0
> = S extends `${any}${infer Tail}` ? LengthOfString<Tail, Sum<L, 1>> : L;

type LengthOfString2<
  S extends string,
  Arr extends unknown[] = []
> = S extends `${infer A}${infer B}`
  ? LengthOfString2<B, [A, ...Arr]>
  : Arr["length"];

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<LengthOfString<"">, 0>>,
  Expect<Equal<LengthOfString<"kumiko">, 6>>,
  Expect<Equal<LengthOfString<"reina">, 5>>,
  Expect<Equal<LengthOfString<"Sound! Euphonium">, 16>>
];

type cases2 = [
  Expect<Equal<LengthOfString2<"">, 0>>,
  Expect<Equal<LengthOfString2<"kumiko">, 6>>,
  Expect<Equal<LengthOfString2<"reina">, 5>>,
  Expect<Equal<LengthOfString2<"Sound! Euphonium">, 16>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/298/answer
  > View solutions: https://tsch.js.org/298/solutions
  > More Challenges: https://tsch.js.org
*/
