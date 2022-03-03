import {Alert, AlertIcon} from "@chakra-ui/react";

const CopiedToast = () => (
  <Alert backgroundColor="primary.500" color="white" status="success" variant="solid">
    <AlertIcon />
    Browser souce link copied to clipboard!
  </Alert>
);

export default CopiedToast;
