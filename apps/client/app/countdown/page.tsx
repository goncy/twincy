import type {NextPage} from "next";

import CountdownScreen from "@/countdown/screens/index";

interface Props {
  searchParams: {
    text: string;
    timer: string;
  };
}

const CountdownPage: NextPage<Props> = ({searchParams: {text, timer}}) => {
  return <CountdownScreen text={text} timer={Number(timer || 600)} />;
};

export default CountdownPage;
