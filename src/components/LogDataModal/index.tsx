import { useEffect, useState } from "react";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import DatePicker from "react-datepicker";

import { DataType } from "@/types";

import style from "./form.module.css";
import { dataExists, deleteData, setData, updateData } from "@/firebase/data";
import ConfirmDelete from "../ConfirmDelete";

interface LogDataModalProps {
  open: boolean;
  data: DataType;
  onClose: () => void;
  fetch: () => void;
  reset: () => void;
}

function LogDataModal(props: LogDataModalProps) {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date());
  const [clockIn, setClockIn] = useState(new Date());
  const [clockOut, setClockOut] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [deleteLog, setDeleteLog] = useState(false);

  useEffect(() => setOpen(props.open), [props.open]);
  useEffect(() => {
    setDate(props.data.clockIn);
    setClockIn(props.data.clockIn);
    setClockOut(props.data.clockOut);
    setNotes(props.data.notes);
  }, [props.data]);

  const handleSubmit = async () => {
    setLoading(true);

    let clockInDate = clockIn;
    clockInDate.setDate(date.getDate());

    let clockOutDate = clockOut;
    clockOutDate.setDate(date.getDate());

    const data = {
      home: props.data.home,
      clockIn: clockInDate,
      clockOut: clockOutDate,
      notes,
    };

    if (
      props.data.id === "add" &&
      (await dataExists(data.home, data.clockIn))
    ) {
      toast({
        title: "Log already exists for this day",
        status: "warning",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });
    } else {
      try {
        if (props.data.id === "add") {
          await setData(data);
          props.fetch();
          props.onClose();
        } else {
          await updateData(props.data.id || "", data);
          props.fetch();
          props.onClose();
        }
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
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    setDeleteLog(false);

    try {
      await deleteData(props.data.id || "");
      props.fetch();

      toast({
        title: "Log data deleted successfully",
        status: "success",
        variant: "left-accent",
        isClosable: true,
        position: "bottom-left",
      });

      setLoading(false);
      props.onClose();
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
  };

  return (
    <>
      <Modal
        isOpen={open}
        size="lg"
        isCentered={true}
        onClose={props.onClose}
        onCloseComplete={props.reset}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log Data</ModalHeader>
          <ModalCloseButton isDisabled={loading} />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap="1rem">
              {props.data.id === "add" ? (
                <GridItem colSpan={12}>
                  {/* <FormLabel>Date</FormLabel> */}
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={(e) => setDate(e || new Date())}
                    footer={
                      <>
                        <Center>{format(date, "PPPP")}</Center>
                      </>
                    }
                  />
                </GridItem>
              ) : null}
              <GridItem colSpan={6}>
                <FormControl>
                  <FormLabel>Clock In</FormLabel>
                  <div className={style.timepicker}>
                    <DatePicker
                      selected={clockIn}
                      onChange={(e) => setClockIn(e || new Date())}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                </FormControl>
              </GridItem>
              <GridItem colSpan={6}>
                <FormControl>
                  <FormLabel>Clock Out</FormLabel>
                  <div className={style.timepicker}>
                    <DatePicker
                      selected={clockOut}
                      onChange={(e) => setClockOut(e || new Date())}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                </FormControl>
              </GridItem>
              <GridItem colSpan={12}>
                <Textarea
                  rows={5}
                  resize="none"
                  placeholder="Notes ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></Textarea>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <HStack spacing="1rem">
              {props.data.id !== "add" ? (
                <Button
                  colorScheme="red"
                  onClick={() => setDeleteLog(true)}
                  isDisabled={loading}
                >
                  Delete
                </Button>
              ) : null}
              <Button
                colorScheme="green"
                isLoading={loading}
                onClick={() => handleSubmit()}
              >
                Log
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDelete
        open={deleteLog}
        title="Delete log?"
        description="Are you sure you want to delete this log data? This action cannot be undone"
        onClose={() => setDeleteLog(false)}
        action={handleDelete}
      />
    </>
  );
}

export default LogDataModal;
