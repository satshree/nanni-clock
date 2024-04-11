"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Divider,
  Box,
  VStack,
  Flex,
  Text,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FiArrowLeft, FiTrash, FiUserPlus } from "react-icons/fi";

import { FamilyType, HomeType } from "@/types";
import {
  addFamily,
  deleteHome,
  getFamily,
  removeFamily,
  setHome,
} from "@/firebase/data";
import {
  loadActiveHomeFromLocalStorage,
  loadAuthStateFromLocalStorage,
} from "@/utils/storage";
import ConfirmDelete from "@/components/ConfirmDelete";
import HomeForm from "@/components/HomeForm";

function Settings() {
  const router = useRouter();
  const toast = useToast();

  const auth = loadAuthStateFromLocalStorage();
  const activeHome = loadActiveHomeFromLocalStorage();

  const [formLoading, setFormLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const [familyList, setFamilyList] = useState<FamilyType[]>([]);

  const [showModal, toggleModal] = useState(false);
  const [newFamily, setNewFamily] = useState("");
  const [newFamilyError, setNewFamilyError] = useState("");

  const [deleteFamily, setDeleteFamily] = useState("");

  const [deleteHomeAlert, setDeleteHome] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const cancelRef = useRef(null);

  useEffect(() => {
    const fetchFamilyList = async () => await fetchFamily();
    fetchFamilyList();
  }, []);

  const fetchFamily = async () =>
    setFamilyList(await getFamily(activeHome.id || ""));

  const onNewFamilyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFamily(e.target.value);
    setNewFamilyError("");
  };

  const handleSubmit = async (data: HomeType) => {
    setFormLoading(true);

    try {
      await setHome(activeHome.id || "", {
        name: data.name,
        hourlyRate: data.hourlyRate,
        description: data.description,
      });

      toast({
        title: "Home information updated",
        status: "info",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });
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

    setFormLoading(false);
  };

  const addFamilySubmit = async (e: FormEvent) => {
    e.preventDefault();

    let proceed = true;

    if (newFamily === "") {
      setNewFamilyError("Email is required!");
      proceed = false;
    }

    if (proceed) {
      setListLoading(true);

      try {
        await addFamily(activeHome.id || "", newFamily);

        fetchFamily();
        toggleModal(false);

        toast({
          title: "New family member added",
          status: "info",
          variant: "left-accent",
          isClosable: true,
          position: "bottom-left",
        });
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

      setListLoading(false);
    }
  };

  const deleteFamilySubmit = async () => {
    try {
      await removeFamily(deleteFamily);

      fetchFamily();

      toast({
        title: "Family member removed",
        status: "info",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });
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

    setDeleteFamily("");
  };

  const deleteHomeSubmit = async () => {
    setDeleteLoading(true);

    try {
      await deleteHome(activeHome.id || "");

      toast({
        title: "Home deleted",
        status: "success",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });

      router.push("/home");
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
    setDeleteLoading(false);
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <Button
          size="sm"
          colorScheme="blue"
          variant="ghost"
          leftIcon={<FiArrowLeft />}
          onClick={() => router.push("/home")}
        >
          Back Home
        </Button>
        <Heading size="md">Manage your home</Heading>
      </Flex>
      <br />
      <Card>
        <CardBody>
          <HomeForm
            add={false}
            data={activeHome}
            loading={formLoading}
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
      <br />
      <Card>
        <CardBody>
          <Flex align="center" justify="space-between">
            <Heading size="md">Family Members</Heading>
            <Button
              colorScheme="blue"
              size="sm"
              leftIcon={<FiUserPlus />}
              onClick={() => toggleModal(true)}
            >
              Add Family Member
            </Button>
          </Flex>
          <br />
          <Divider />
          <br />
          <VStack spacing="1rem">
            {familyList.map((f) => (
              <Box borderWidth={0.8} borderRadius={8} w="100%" p="1rem">
                <Flex w="100%" align="center" justify="space-between">
                  <Text>{f.user}</Text>
                  <IconButton
                    isDisabled={auth.user.email === f.user}
                    icon={<FiTrash />}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    aria-label={""}
                    onClick={() => setDeleteFamily(f.id || "")}
                  />
                </Flex>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
      <br />
      <Card>
        <CardBody>
          <Heading size="md">Danger Zone</Heading>
          <br />
          <Divider />
          <br />
          <Box w="100%" p="1rem" borderWidth={0.8} borderRadius={8}>
            <Flex align="center" justify="space-between">
              <Text fontWeight={600}>Delete this home</Text>
              <Button colorScheme="red" onClick={() => setDeleteHome(true)}>
                Delete
              </Button>
            </Flex>
          </Box>
        </CardBody>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => toggleModal(false)}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Family Member</ModalHeader>
          <ModalCloseButton isDisabled={listLoading} />
          <form onSubmit={addFamilySubmit}>
            <ModalBody>
              <FormControl isInvalid={newFamilyError !== ""}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email of this family member ..."
                  value={newFamily}
                  onChange={onNewFamilyChange}
                />
                {newFamilyError ? (
                  <FormErrorMessage>{newFamilyError}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Make sure to add a trusted user!
                  </FormHelperText>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" type="submit">
                Add
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <ConfirmDelete
        open={deleteFamily !== ""}
        title="Delete Family Member"
        description="Are you sure you want to remove this family member? You can add them back later on."
        action={deleteFamilySubmit}
        onClose={() => setDeleteFamily("")}
      />

      <ConfirmDelete
        open={deleteHomeAlert}
        title="Delete This Home"
        description="Are you sure you want to delete this home? All data associated with this home will be lost and this action cannot be undone!"
        action={() => {
          setDeleteHome(false);
          setConfirmDelete(true);
        }}
        onClose={() => setDeleteHome(false)}
      />

      <AlertDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        leastDestructiveRef={cancelRef}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete this home
            </AlertDialogHeader>

            <AlertDialogBody>
              Proceeding forward will delete all data associated with this home
              and this action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setConfirmDelete(false)}
                isDisabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteHomeSubmit}
                ml={3}
                isLoading={deleteLoading}
              >
                I Understand
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Settings;
