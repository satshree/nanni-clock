"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Center,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  SimpleGrid,
  Textarea,
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
} from "@chakra-ui/react";
import { FiArrowLeft, FiTrash, FiUserPlus } from "react-icons/fi";

import { DataType, FamilyType, HomeType } from "@/types";
import { addFamily, getFamily, removeFamily, setHome } from "@/firebase/data";
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
    </>
  );
}

export default Settings;
