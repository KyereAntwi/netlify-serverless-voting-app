import {
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";

interface MutationAlertProps {
  isOpen: boolean;
  status: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
}

export default function MutationAlert({
  status,
  title,
  description,
}: MutationAlertProps) {
  const { onClose } = useDisclosure({ defaultIsOpen: false });

  return (
    <Alert status={status}>
      <AlertIcon />
      <Box>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  );
}
