import SponsorsScreen from "@/sponsor/screens";

interface Props {
  searchParams: {
    duration: string;
    loop: string;
  };
}

const SponsorsPage = ({searchParams: {duration, loop}}: Props) => {
  return (
    <SponsorsScreen
      duration={Number(duration || 1000 * 10)}
      loop={Number(loop || 1000 * 60 * 10)}
    />
  );
};

export default SponsorsPage;
