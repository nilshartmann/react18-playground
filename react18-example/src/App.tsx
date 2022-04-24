import {
  useEffect,
  useState,
  useTransition,
  memo,
  useDeferredValue,
} from "react";

const HeavyStuff = memo(function SlowUI({ value }: { value: string }) {
  const count = offset + value.length;

  // console.log("SlowUI value - ", value);
  return (
    <>
      {Array(count)
        .fill(1)
        .map((_, index) => (
          <Span key={index} value={count} index={index} />
        ))}
    </>
  );
});

let lastValue = -1;
let lastIndex = -1;

function Span({ value, index }: any) {
  // if (value !== lastValue) {
  //   console.log(
  //     "lastValue",
  //     lastValue,
  //     "lastIndex",
  //     lastIndex,
  //     "current value",
  //     value,
  //     "current index",
  //     index
  //   );
  //   lastValue = value;
  // }
  lastIndex = index;
  // console.log("Span ", value, index);
  return <span>{value - index} </span>;
}

const offset = 99999;

function App() {
  const [value, setValue] = useState("");
  const x = useDeferredValue(value);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  // console.log(
  //   ">>>> App , value",
  //   value,
  //   "value2",
  //   value2,
  //   "pending",
  //   isPending
  // );

  useEffect(() => {
    const thisValue = value;
    const thisValue2 = searchTerm;
    const thisPending = isPending;

    console.log(
      "Rendered with input value",
      thisValue,
      " and search string ",
      thisValue2,

      "search string pending: ",
      thisPending,
      "defValue",
      x
    );
  });

  const handleClick = (newValue: string) => {
    // console.log("App, setValue", newValue);
    // const newValue2 = offset + newValue.length;
    setValue(newValue);

    startTransition(() => {
      // console.log("App, startTransition", newValue);
      setSearchTerm(newValue);
    });
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => handleClick(e.target.value)}
      />
      <div
        style={{
          visibility: isPending ? "hidden" : "visible",
        }}
      >
        <HeavyStuff value={searchTerm} />
      </div>
    </>
  );
}

export default App;
