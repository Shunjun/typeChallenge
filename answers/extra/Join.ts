type Join<T extends any[], S extends string = ""> = T extends [
  infer U,
  ...infer K
]
  ? U extends string
    ? Join<K, `${S}${U}`>
    : Join<K, S>
  : S;

type StringArray = ["1", "2", "3"];
type Expected = "123";

type Result = Join<StringArray>;
