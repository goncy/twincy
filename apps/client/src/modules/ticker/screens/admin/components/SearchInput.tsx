import {SearchIcon} from "@chakra-ui/icons";
import {InputGroup, Input, InputRightElement, CloseButton} from "@chakra-ui/react";

type Props = {
  value: null | string;
  onChange: (value: string) => void;
  onClose: VoidFunction;
};

const SearchInput: React.FC<Props> = ({value, onChange, onClose}) => {
  if (value === null) {
    return (
      <SearchIcon
        color="white"
        cursor="pointer"
        height={5}
        width={5}
        onClick={() => onChange("")}
      />
    );
  }

  return (
    <InputGroup size="md">
      <Input
        autoFocus
        height={7}
        paddingRight={7}
        placeholder="Search..."
        size="xs"
        onChange={(e) => onChange(e.target.value)}
      />
      <InputRightElement height={7} width={7}>
        <CloseButton size="sm" onClick={onClose} />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
