"use client";

import { createContext, useEffect, useState } from "react";
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
import { Moment } from "moment";
import { FiChevronDown } from "react-icons/fi";

import { getData, getHome } from "@/firebase/data";
import { DataType, HomeType } from "@/types";
import {
  countHours,
  getCurrentWeek,
  getDate,
  getTime,
  hourDifference,
} from "@/utils";

import WeekPicker from "@/components/WeekPicker";
import LogDataModal from "@/components/LogDataModal";

import style from "./home.module.css";

import loading from "@/assets/img/loading.svg";
import empty from "@/assets/img/empty.svg";
import {
  loadActiveHomeFromLocalStorage,
  saveActiveHomeToLocalStore,
} from "@/utils/storage";

const dummyHomeData: HomeType = {
  id: "",
  name: "",
  hourlyRate: 0,
  description: "",
  uniqueCode: "",
};

const dummyLogData: DataType = {
  id: "",
  clockIn: new Date(),
  clockOut: new Date(),
  home: "",
  notes: "",
};

function Home() {
  const activeHomeLocal = loadActiveHomeFromLocalStorage();

  const [fetched, setFetched] = useState(false);

  const [filterDate, setFilterDate] = useState<Moment[]>(getCurrentWeek());

  const [home, setHome] = useState<HomeType[]>([]);
  const [activeHome, setActiveHome] = useState<HomeType>(activeHomeLocal);

  const [data, setData] = useState<DataType[]>([]);
  const [showModal, toggleModal] = useState(false);
  const [modalData, setModalData] = useState<DataType>(dummyLogData);

  const fetchHome = async () => {
    const homes = await getHome();
    setHome(homes);
  };

  const fetchData = async () => {
    if (activeHome !== undefined && activeHome.id !== "") {
      const data = await getData(activeHome.id || "", filterDate);
      setData(data);
    }
  };

  useEffect(() => {
    fetchHome();

    setTimeout(() => setFetched(true), 1500);
  }, []);

  useEffect(() => {
    fetchData();
    saveActiveHomeToLocalStore(activeHome);
  }, [activeHome, filterDate]);

  useEffect(() => {
    if (home.length > 0 ?? activeHome.id === "") {
      setActiveHome(home[0]);
      saveActiveHomeToLocalStore(home[0]);
    }
  }, [home]);

  const getSummary = () => {
    const totalHours = countHours(data);

    return (
      <>
        {totalHours}
        <Text fontSize="smaller">
          (${(totalHours * activeHome.hourlyRate).toFixed(2)})
        </Text>
      </>
    );
  };

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
              <Flex align="center" justify="space-between" flexWrap="wrap">
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
                  <Button colorScheme="blue" isDisabled={data.length === 0}>
                    Generate Invoice
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      setModalData({
                        ...dummyLogData,
                        id: "add",
                        home: activeHome.id || "",
                      });
                      toggleModal(true);
                    }}
                  >
                    Log Data
                  </Button>
                </HStack>
              </Flex>
              <br />
              <Grid templateColumns="repeat(12, 1fr)" gap="1rem">
                <GridItem colSpan={{ base: 12, md: 4 }}>
                  <Card borderRadius="8px">
                    <CardBody>
                      <Center>
                        <WeekPicker
                          onWeekChange={(dates) => setFilterDate(dates)}
                          selectedDays={filterDate}
                        />
                      </Center>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 8 }} overflowX="auto">
                  <Table className={style.table}>
                    <Thead>
                      <Tr>
                        <Th w="1%">Day</Th>
                        <Th>Date</Th>
                        <Th>Clock In</Th>
                        <Th>Clock Out</Th>
                        <Th>Total Hours</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.length > 0 ? (
                        <>
                          {data.map((d, index) => (
                            <Tr
                              className={style.hoverable}
                              key={d.id}
                              onClick={() => {
                                setModalData(d);
                                toggleModal(true);
                              }}
                            >
                              <Td>{index + 1}</Td>
                              <Td>{getDate(d.clockIn)}</Td>
                              <Td>{getTime(d.clockIn)}</Td>
                              <Td>{getTime(d.clockOut)}</Td>
                              <Td>{hourDifference(d.clockIn, d.clockOut)}</Td>
                            </Tr>
                          ))}
                          <Tr>
                            <Td colSpan={4}>
                              <Heading size="sm" float="right">
                                Total
                              </Heading>
                            </Td>
                            <Td>{getSummary()}</Td>
                          </Tr>
                        </>
                      ) : (
                        <Tr>
                          <Td colSpan={4}>
                            <Center>
                              <Image
                                src={empty.src}
                                width={350}
                                height={350}
                                alt="No Log Data"
                              />
                            </Center>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </GridItem>
              </Grid>
            </Box>
          </>
        )
      ) : (
        <>
          <br />
          <br />
          <Center>
            <Image
              src={loading.src}
              width={450}
              height={450}
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
        </>
      )}

      <LogDataModal
        open={showModal}
        data={modalData}
        onClose={() => toggleModal(false)}
        reset={() => setModalData(dummyLogData)}
        fetch={fetchData}
      />
    </>
  );
}

export default Home;
