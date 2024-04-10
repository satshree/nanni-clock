"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";

import { getData, getHome } from "@/firebase/data";
import { DataType, HomeType } from "@/types";

import loading from "@/assets/img/loading.svg";
import { getDate, getTime } from "@/utils";

const dummyHomeData: HomeType = {
  id: "",
  name: "",
  hourlyRate: 0,
  description: "",
};

function Home() {
  const [fetched, setFetched] = useState(false);

  const [home, setHome] = useState<HomeType[]>([]);
  const [activeHome, setActiveHome] = useState<HomeType>(dummyHomeData);

  const [data, setData] = useState<DataType[]>([]);

  const fetchHome = async () => {
    const homes = await getHome();
    setHome(homes);
  };

  const fetchData = async () => {
    if (activeHome !== undefined && activeHome.id !== "") {
      const data = await getData(activeHome.id);
      setData(data);
    }
  };

  useEffect(() => {
    fetchHome();

    setTimeout(() => setFetched(true), 1500);
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeHome]);

  useEffect(() => {
    if (home.length > 0 ?? activeHome.id === "") setActiveHome(home[0]);
  }, [home]);

  return (
    <>
      {fetched ? (
        home.length === 0 ? (
          <>
            <Flex h="100%" w="100%" align="center" justify="center">
              <Box>
                <Center>
                  <Heading size="md">Let's create a home</Heading>
                </Center>
              </Box>
            </Flex>
          </>
        ) : (
          <>
            <Box p="0.5rem">
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  Showing Data for
                  <Menu>
                    <MenuButton
                      ml="0.5rem"
                      as={Button}
                      variant="ghost"
                      rightIcon={<FiChevronDown />}
                    >
                      {activeHome.name}
                    </MenuButton>
                    <MenuList>
                      {home.map((h) => (
                        <MenuItem
                          key={h.id}
                          isDisabled={h.id === activeHome.id}
                          onClick={() => setActiveHome(h)}
                        >
                          {h.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </Flex>
                <HStack>
                  <Button colorScheme="blue">Generate Report</Button>
                  <Button colorScheme="blue">Log Data</Button>
                </HStack>
              </Flex>
              <br />
              <Grid templateColumns="repeat(12, 1fr)" gap="1rem">
                <GridItem colSpan={4}>
                  <Card borderRadius="8px">
                    <CardBody>daterange filter</CardBody>
                  </Card>
                </GridItem>
                <GridItem colSpan={8}>
                  <Table>
                    <Thead>
                      <Th w="1%">Day</Th>
                      <Th>Date</Th>
                      <Th>Clock In</Th>
                      <Th>Clock Out</Th>
                      <Th></Th>
                    </Thead>
                    <Tbody>
                      {data.map((d, index) => (
                        <Tr key={d.id}>
                          <Td>{index + 1}</Td>
                          <Td>{getDate(d.clockIn)}</Td>
                          <Td>{getTime(d.clockIn)}</Td>
                          <Td>{getTime(d.clockOut)}</Td>
                          <Td>
                            <HStack spacing="0.5rem">
                              <IconButton
                                icon={<FiEdit />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                aria-label={""}
                              />
                              <IconButton
                                icon={<FiTrash />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                aria-label={""}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </GridItem>
              </Grid>
            </Box>
          </>
        )
      ) : (
        <>
          <Flex h="100%" w="100%" align="center" justify="center">
            <Box>
              <Center>
                <Image
                  src={loading.src}
                  width={400}
                  height={400}
                  alt="Loading ..."
                />
              </Center>
              <br />
              <Center>
                <Flex align="center">
                  <Spinner mr="0.5rem" />
                  <Text>Loading ...</Text>
                </Flex>
              </Center>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
}

export default Home;
