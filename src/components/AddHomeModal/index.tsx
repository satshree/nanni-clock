"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import { HomeType } from "@/types";
import { addHome } from "@/firebase/data";
import HomeForm from "../HomeForm";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  // fetch: () => void;
}

const dummyHomeData: HomeType = {
  name: "",
  hourlyRate: 0,
  description: "",
};

function AddHomeModal(props: ModalProps) {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setOpen(props.open), [props.open]);

  const handleSubmit = async (data: HomeType) => {
    setLoading(true);

    try {
      await addHome({
        name: data.name,
        hourlyRate: data.hourlyRate,
        description: data.description,
      });

      // props.fetch();
      props.onClose();

      toast({
        title: "New home added",
        status: "info",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });

      window.location.reload();
    } catch (error) {
      console.log("ERROR", error);

      toast({
        title: "Something went wrong",
        status: "error",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={props.onClose} isCentered={true} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Home</ModalHeader>
          <ModalCloseButton isDisabled={loading} />
          <ModalBody>
            <HomeForm
              data={dummyHomeData}
              add={true}
              onSubmit={handleSubmit}
              loading={loading}
            />
            <br />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddHomeModal;
