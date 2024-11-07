import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  GridItem,
  Heading,
  Box,
  VStack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Flex,
  Select,
  Center,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

import DataWidget from "../DataWidget";

import {
  AnalyticsDailyApiResponse,
  AnalyticsMonthlyApiResponse,
  AnalyticsTotalApiResponse,
} from "@/types/api";
import { GlobalState } from "@/types";

import { parseMonth } from "@/utils";

interface AnalyticsModalProps {
  show: boolean;
  data: {
    total: AnalyticsTotalApiResponse;
    monthly: AnalyticsMonthlyApiResponse;
    daily: AnalyticsDailyApiResponse;
  };
  onClose: () => void;
}

export default function AnalyticsModal(props: AnalyticsModalProps) {
  const activeHome = useSelector((state: GlobalState) => state.activeHome);

  const [show, setShow] = useState(false);
  const [totalData, setTotalData] = useState<AnalyticsTotalApiResponse>(
    props.data.total
  );
  const [monthlyData, setMonthlyData] = useState<AnalyticsMonthlyApiResponse>(
    props.data.monthly
  );
  const [dailyData, setDailyData] = useState<AnalyticsDailyApiResponse>(
    props.data.daily
  );

  const [showMonth, setShowMonth] = useState("");

  useEffect(() => setShow(props.show), [props.show]);

  useEffect(() => setTotalData(props.data.total), [props.data.total]);
  useEffect(() => {
    setMonthlyData(props.data.monthly);
    // setShowMonth(Object.keys(monthlyData)[0]);
  }, [props.data.monthly]);
  useEffect(() => setDailyData(props.data.daily), [props.data.daily]);

  const getDailyData = () => {
    let data: {
      day: string;
      hours: number;
      cost: number;
    }[] = [];

    for (const [day, d] of Object.entries(dailyData)) {
      data.push({
        day,
        hours: parseFloat(d.totalHour.toFixed(2)),
        cost: parseFloat(d.totalCost.toFixed(2)),
      });
    }

    return data;
  };

  return (
    <Modal
      isCentered={true}
      // scrollBehavior="inside"
      size="xl"
      isOpen={show}
      onClose={props.onClose}
      onCloseComplete={() => {
        setShowMonth("");
      }}
    >
      <ModalOverlay />
      <ModalContent maxWidth="80vw">
        <ModalHeader>Analytics for {activeHome.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap="1rem">
            <GridItem colSpan={{ base: 2, md: 1 }} order={{ base: 2, md: 1 }}>
              <Heading size="md">Daily</Heading>
              <TableContainer mt="1rem">
                <Table>
                  <Thead>
                    <Tr>
                      <Th textAlign="center">Day</Th>
                      <Th textAlign="end">Hours</Th>
                      <Th>Cost</Th>
                    </Tr>
                  </Thead>
                </Table>
              </TableContainer>
              <Box height="30rem" overflow="scroll">
                <TableContainer>
                  <Table>
                    <Tbody>
                      {Object.keys(dailyData).length > 0 ? (
                        getDailyData().map((data) => (
                          <Tr key={data.day}>
                            <Td>{data.day}</Td>
                            <Td>{data.hours}</Td>
                            <Td>${data.cost}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={3}>
                            <Center>No data</Center>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </GridItem>
            <GridItem colSpan={{ base: 2, md: 1 }} order={{ base: 1, md: 2 }}>
              <VStack spacing="1rem" alignItems="flex-start">
                <Box w="100%">
                  <Heading size="md">Total</Heading>
                  <VStack mt="1rem" gap="1rem">
                    <DataWidget
                      data={totalData.totalHours.toFixed(2)}
                      title="Hours"
                    />
                    <DataWidget
                      data={totalData.totalDays.toString()}
                      title="Days"
                    />{" "}
                    <DataWidget
                      data={`$ ${totalData.totalCost.toFixed(2)}`}
                      title="Cost"
                    />
                  </VStack>
                </Box>
                <Box w="100%">
                  <Heading size="md">Monthly</Heading>
                  <Box w="100%" mt="1rem">
                    <Select
                      value={showMonth}
                      placeholder="Choose month"
                      onChange={(e) => setShowMonth(e.target.value)}
                    >
                      {Object.keys(monthlyData).map((m) => (
                        <option key={m} value={m}>
                          {parseMonth(m)}
                        </option>
                      ))}
                    </Select>
                    {showMonth === "" ? (
                      <Center p="1rem">
                        Select month to display monthly analytics
                      </Center>
                    ) : (
                      <VStack mt="1rem" gap="1rem">
                        <DataWidget
                          data={monthlyData[showMonth]?.totalHours.toFixed(2)}
                          title="Hours"
                        />
                        <DataWidget
                          data={monthlyData[showMonth]?.totalDays.toString()}
                          title="Days"
                        />{" "}
                        <DataWidget
                          data={`$ ${monthlyData[showMonth]?.totalCost.toFixed(
                            2
                          )}`}
                          title="Cost"
                        />
                      </VStack>
                    )}
                  </Box>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={props.onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
