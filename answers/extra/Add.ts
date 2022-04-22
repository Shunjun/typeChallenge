type CreatArray<
  N extends number,
  Arr extends any[] = []
> = Arr["length"] extends N ? Arr : CreatArray<N, [N, ...Arr]>;

type Add<N extends number, M extends number> = [
  ...CreatArray<N>,
  ...CreatArray<M>
]["length"] extends number
  ? [...CreatArray<N>, ...CreatArray<M>]["length"]
  : never;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [Expect<Equal<Add<18, 42>, 60>>];
