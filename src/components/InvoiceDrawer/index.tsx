import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Button,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { DataType, GlobalState } from "@/types";
import { useSelector } from "react-redux";
import {
  countHours,
  getDate,
  getDateWithDay,
  getTime,
  hourDifference,
} from "@/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  reset: () => void;
  data: DataType[];
  week: string;
}

type DataModifiedType = DataType & {
  dateWithDay: string;
  hours: number;
  total: number;
};

function InvoiceDrawer(props: DrawerProps) {
  const [open, setOpen] = useState(false);
  const [week, setWeek] = useState("");
  const [data, setData] = useState<DataModifiedType[]>([]);

  const [totalHours, setTotalHours] = useState(0.0);
  const [totalCost, setTotalCost] = useState(0.0);

  const activeHome = useSelector((state: GlobalState) => state.activeHome);

  useEffect(() => setOpen(props.open), [props.open]);
  useEffect(() => setWeek(props.week), [props.week]);
  useEffect(() => {
    const dataModified = props.data.map((d) => {
      const hours = parseFloat(hourDifference(d.clockIn, d.clockOut));

      return {
        ...d,
        dateWithDay: getDateWithDay(d.clockIn),
        hours,
        total: hours * activeHome.hourlyRate,
      };
    });

    setData(dataModified);

    const totalHour = countHours(dataModified);

    setTotalHours(totalHour);
    setTotalCost(totalHour * activeHome.hourlyRate);
  }, [props.data]);

  return (
    <>
      <Drawer isOpen={open} onClose={props.onClose} size="lg" placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Invoice</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <br />
            <Heading size="lg">{activeHome.name}</Heading>
            <Text>Invoice for {week}</Text>
            <Text>Invoice Generated at {getDate(new Date())}</Text>
            <Table mt="2.5rem">
              <Thead>
                <Tr>
                  <Th w="100%">Description</Th>
                  <Th>Hours</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((d) => (
                  <Tr key={d.id}>
                    <Td>
                      {d.dateWithDay}
                      <Text fontSize="smaller" color="gray">
                        {getTime(d.clockIn)} – {getTime(d.clockOut)}
                      </Text>
                    </Td>
                    <Td>{d.hours}</Td>
                    <Td>${d.total.toFixed(2)}</Td>
                  </Tr>
                ))}
                <Tr borderTop="2px solid gray">
                  <Td>
                    <Heading size="sm" float="right">
                      Total
                    </Heading>
                  </Td>
                  <Td>{totalHours}</Td>
                  <Td>
                    <Text fontWeight={600}>${totalCost.toFixed(2)} </Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing="0.5rem">
              <Button onClick={props.onClose}>Close</Button>
              <Button colorScheme="blue">Download</Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default InvoiceDrawer;
