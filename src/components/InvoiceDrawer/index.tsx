import { useEffect, useRef, useState } from "react";
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
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import generatePDF, { Margin, Options } from "react-to-pdf";

import { DataType, GlobalState } from "@/types";

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
  const invoice = useRef(null);

  const [open, setOpen] = useState(false);
  const [week, setWeek] = useState("");
  const [data, setData] = useState<DataModifiedType[]>([]);

  const [totalHours, setTotalHours] = useState(0.0);
  const [totalCost, setTotalCost] = useState(0.0);

  const activeHome = useSelector((state: GlobalState) => state.activeHome);

  const pdfOptions: Options = {
    filename: `${activeHome.name}-${week}.pdf`,
    page: {
      margin: Margin.MEDIUM,
      format: "letter",
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

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
      <Drawer isOpen={open} onClose={props.onClose} size="xl" placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Invoice</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <Box ref={invoice}>
              <VStack spacing="0.5rem" align="start" pl="1rem">
                <Heading size="lg">{activeHome.name}</Heading>
                <br />
                <Text>Invoice for {week}</Text>
                <Text>Invoice Generated at {getDate(new Date())}</Text>
                <Text>
                  Hourly Pay Rate of ${activeHome.hourlyRate.toFixed(2)}
                </Text>
              </VStack>
              <Table mt="1.5rem">
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
                          {getTime(d.clockIn)} – {getTime(d.clockOut)}
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
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing="0.5rem">
              <Button onClick={props.onClose}>Close</Button>
              <Button
                colorScheme="blue"
                onClick={() => generatePDF(invoice, pdfOptions)}
              >
                Download
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default InvoiceDrawer;
