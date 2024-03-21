import CountdownScreen from "@/countdown/screens/index";

const CountdownPage = ({
  searchParams: {text, timer},
}: {
  searchParams: {
    text: string;
    timer: string;
  };
}) => {
  return <CountdownScreen text={text} timer={Number(timer || 600)} />;
};

export default CountdownPage;
