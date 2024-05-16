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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment, { Moment } from "moment";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";
import { TbHomePlus } from "react-icons/tb";

import { getData, getHome } from "@/firebase/data";
import { DataType, HomeType, GlobalState } from "@/types";
import {
  countHours,
  firstAndLastDayOfWeek,
  getCurrentWeek,
  getDate,
  getTime,
  hourDifference,
  getDateWithDay,
  getDateWithShortDay,
} from "@/utils";

import WeekPicker from "@/components/WeekPicker";
import LogDataModal from "@/components/LogDataModal";
import InvoiceDrawer from "@/components/InvoiceDrawer";

import { setActiveHome } from "@/redux/actions";

import {
  loadAuthStateFromLocalStorage,
  removeActiveHomeFromLocalStorage,
} from "@/utils/storage";

import style from "./home.module.css";

import loading from "@/assets/img/loading.svg";
import empty from "@/assets/img/empty.svg";
import build from "@/assets/img/build.svg";
import { isTodayLogged } from "@/firebase/utils";

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
  const dispatch = useDispatch();

  const auth = loadAuthStateFromLocalStorage();

  const currentWeek = getCurrentWeek();

  const [fetched, setFetched] = useState(false);

  const [filterDate, setFilterDate] = useState<Moment[]>(currentWeek);

  const activeHomeState = useSelector((state: GlobalState) => state.activeHome);
  const [activeHome, updateActiveHome] = useState<HomeType>(activeHomeState);

  const [home, setHome] = useState<HomeType[]>([]);
  const [today] = useState(moment());

  const [data, setData] = useState<DataType[]>([]);
  const [todayLogged, setTodayLogged] = useState(false);
  const [showModal, toggleModal] = useState(false);
  const [modalData, setModalData] = useState<DataType>(dummyLogData);

  const [invoiceDrawer, setInvoiceDrawer] = useState(false);
  const [invoiceData, setInvoiceData] = useState<DataType[]>([]);
  const [invoiceWeek, setInvoiceWeek] = useState("");

  const fetchHome = async () => {
    const homes = await getHome();
    setHome(homes);

    if (homes.length === 0) {
      removeActiveHomeFromLocalStorage();
      dispatch(setActiveHome(dummyHomeData));
    }
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

  useEffect(() => updateActiveHome(activeHomeState), [activeHomeState]);

  useEffect(() => {
    fetchData();
  }, [activeHome, filterDate]);

  useEffect(() => {
    const updateHome = () => {
      if (home.length > 0 ?? activeHome.id === "")
        dispatch(setActiveHome(home[0]));
    };

    updateHome();
  }, [home]);

  useEffect(() => setTodayLogged(isTodayLogged(data)), [data]);

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

  const generateInvoice = () => {
    setInvoiceData(data);
    setInvoiceWeek(firstAndLastDayOfWeek(filterDate));
    setInvoiceDrawer(true);
  };

  return (
    <>
      {fetched ? (
        home.length === 0 ? (
          <>
            <Flex
              h="100%"
              w="100%"
              align="center"
              justify="center"
              flexDir="column"
            >
              <Center>
                <Image
                  src={build.src}
                  height={350}
                  width={350}
                  alt="build home"
                />
              </Center>
              <Center mt="1rem">
                <Heading size="sm" textAlign="center">
                  Create a home from the menu at top right corner
                </Heading>
              </Center>
              <Center mt="1rem">
                <Text>OR</Text>
              </Center>
              <Center mt="1rem">
                <Heading size="sm" textAlign="center">
                  You can request a family member who has created a home to add
                  you in their home
                </Heading>
              </Center>
            </Flex>
          </>
        ) : (
          <>
            <Box p="0.5rem">
              <Heading size="md" mb="0.25rem">
                Hello {auth.user.displayName}
              </Heading>
              <Text>Its {today.format("MMMM Do, YYYY")}</Text>
            </Box>
            <Box p="0.5rem">
              <SimpleGrid columns={{ sm: 1, md: 2 }}>
                <Flex align="center" justify="center">
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
                            onClick={() => dispatch(setActiveHome(h))}
                          >
                            {h.name}
                          </MenuItem>
                        ))}
                        <MenuItem isDisabled={true}>
                          <Center>
                            <Text fontSize="smaller">
                              <Flex alignItems="center">
                                <h1 style={{ marginRight: "0.5rem" }}>
                                  <TbHomePlus />
                                </h1>
                                Add new from menu bar
                              </Flex>
                            </Text>
                          </Center>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </Flex>
                <Flex align="center" justify="center">
                  <HStack m="1rem" mr="0">
                    <Button
                      colorScheme="blue"
                      isDisabled={data.length === 0}
                      onClick={generateInvoice}
                    >
                      Generate Invoice
                    </Button>
                    <Button
                      colorScheme={todayLogged ? "blue" : "green"}
                      onClick={() => {
                        setModalData({
                          ...dummyLogData,
                          id: "add",
                          home: activeHome.id || "",
                        });
                        toggleModal(true);
                      }}
                    >
                      {/* {todayLogged ? "Log Data" : "Log Today's Hour"} */}
                      Log Data
                    </Button>
                  </HStack>
                </Flex>
              </SimpleGrid>
              <br />
              <Grid templateColumns="repeat(12, 1fr)" gap="1rem">
                <GridItem colSpan={{ base: 12, md: 4 }}>
                  <Card borderRadius="8px">
                    <CardBody>
                      <Center>
                        <Text
                          fontSize="smaller"
                          mb="0.5rem"
                          _hover={{ cursor: "pointer" }}
                          onClick={() => setFilterDate(currentWeek)}
                        >
                          Show current week
                        </Text>
                      </Center>
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
                        <Th>Date</Th>
                        <Th>Clock In</Th>
                        <Th>Clock Out</Th>
                        <Th>Total Hours</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.length > 0 ? (
                        <>
                          {data.map((d) => (
                            <Tr
                              className={style.hoverable}
                              key={d.id}
                              onClick={() => {
                                setModalData(d);
                                toggleModal(true);
                              }}
                            >
                              <Td>{getDateWithShortDay(d.clockIn)}</Td>
                              <Td>{getTime(d.clockIn)}</Td>
                              <Td>{getTime(d.clockOut)}</Td>
                              <Td>{hourDifference(d.clockIn, d.clockOut)}</Td>
                            </Tr>
                          ))}
                          <Tr>
                            <Td colSpan={3}>
                              <Heading size="sm" float="right">
                                Total
                              </Heading>
                            </Td>
                            <Td>{getSummary()}</Td>
                          </Tr>
                        </>
                      ) : (
                        <Tr>
                          <Td colSpan={3}>
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

      <InvoiceDrawer
        open={invoiceDrawer}
        data={invoiceData}
        week={invoiceWeek}
        onClose={() => setInvoiceDrawer(false)}
        reset={() => {
          setInvoiceData([]);
          setInvoiceWeek("");
        }}
      />
    </>
  );
}

export default Home;
