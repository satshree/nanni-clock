import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";

interface ConfirmDeleteProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  action: () => void;
}

function ConfirmDelete(props: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => setOpen(props.open), [props.open]);
  useEffect(() => setTitle(props.title), [props.title]);
  useEffect(() => setDescription(props.description), [props.description]);

  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        isOpen={open}
        onClose={props.onClose}
        leastDestructiveRef={cancelRef}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={props.onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={props.action} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default ConfirmDelete;
