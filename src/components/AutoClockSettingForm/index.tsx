import { FormEvent, useEffect, useState } from "react";
import moment from "moment";
import {
  Grid,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Button,
  Flex,
  GridItem,
  CheckboxGroup,
  Checkbox,
  Stack,
  Center,
  Divider,
  // Select,
} from "@chakra-ui/react";
import SelectSearch from "react-select-search";
import DatePicker from "react-datepicker";

import {
  getCurrentTimezone,
  getTimezoneUTCList,
  // getTimezoneWithValue,
  getTimezoneWithZone,
} from "@/utils/timezone";

import { AutoClockType } from "@/types";

import style from "./style.module.css";

interface AutoClockSettingFormProps {
  data: AutoClockType;
  onSubmit: (data: AutoClockType) => void;
}

function AutoClockSettingForm(props: AutoClockSettingFormProps) {
  const currentTimezone = getCurrentTimezone();
  const [changes, setChanges] = useState(false);

  const [autoClockStart, setAutoClockStart] = useState(new Date());
  const [autoClockEnd, setAutoClockEnd] = useState(new Date());
  const [autoDailyClock, setAutoDailyClock] = useState<string[]>([]);
  const [timezoneSelect, setTimezoneSelect] = useState(currentTimezone);

  useEffect(() => {
    const clockInData = moment(props.data.autoClockStart, "h:mm A");
    const today = moment().startOf("day");
    const dateObject = today
      .set({
        hour: clockInData.hour(),
        minute: clockInData.minute(),
        second: 0,
        millisecond: 0,
      })
      .toDate();
    setAutoClockStart(dateObject);
  }, [props.data.autoClockStart]);

  useEffect(() => {
    const clockInData = moment(props.data.autoClockEnd, "h:mm A");
    const today = moment().startOf("day");
    const dateObject = today
      .set({
        hour: clockInData.hour(),
        minute: clockInData.minute(),
        second: 0,
        millisecond: 0,
      })
      .toDate();
    setAutoClockEnd(dateObject);
  }, [props.data.autoClockEnd]);

  useEffect(
    () => setAutoDailyClock(props.data.autoDailyClock),
    [props.data.autoDailyClock]
  );

  useEffect(
    () => setTimezoneSelect(props.data.timezone?.value || currentTimezone),
    [props.data.timezone]
  );

  const getTimezoneSelectList = () =>
    getTimezoneUTCList().map((tz) => ({
      name: `${tz.value}${
        tz.value === currentTimezone ? " (Your current timezone)" : ""
      }`,
      value: tz.value,
    }));

  const onAutoClockStartChange = (e: Date) => {
    setAutoClockStart(e);
    setChanges(true);
  };

  const onAutoClockEndChange = (e: Date) => {
    setAutoClockEnd(e);
    setChanges(true);
  };

  const onAutoDailyClockChange = (e: string[]) => {
    setAutoDailyClock(e);
    setChanges(true);
  };

  const onTimezoneChange = (e: string) => {
    setTimezoneSelect(e);
    setChanges(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setChanges(false);

    props.onSubmit({
      ...props.data,
      autoClockStart: moment(autoClockStart).format("h:mm A"),
      autoClockEnd: moment(autoClockEnd).format("h:mm A"),
      autoDailyClock,
      timezone: {
        value: timezoneSelect,
        offset: getTimezoneWithZone(timezoneSelect)?.offset || 0,
      },
    });
  };

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap="1rem">
        <GridItem colSpan={6}>
          <Heading size="md">Auto Clock In</Heading>
        </GridItem>
        <GridItem colSpan={6}>
          <Text float="right" fontSize="sm">
            Setup auto clocking in so you won&apos;t have to keep logging data
            every day
          </Text>
        </GridItem>
      </Grid>
      <br />
      <Divider />
      <br />
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(3, 1fr)" gap="1rem">
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <FormControl>
              <FormLabel>Auto Clock In</FormLabel>
              <div className={style.timepicker}>
                <DatePicker
                  selected={autoClockStart}
                  onChange={(e) => onAutoClockStartChange(e || new Date())}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                />
              </div>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <FormControl>
              <FormLabel>Auto Clock Out</FormLabel>
              <div className={style.timepicker}>
                <DatePicker
                  selected={autoClockEnd}
                  onChange={(e) => onAutoClockEndChange(e || new Date())}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                />
              </div>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <FormControl>
              <FormLabel>Timezone</FormLabel>
              {/* <Select
                value={timezoneSelect}
                onChange={(e) => onTimezoneChange(e.target.value)}
              >
                {getTimezoneUTCList().map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.value}
                  </option>
                ))}
              </Select> */}
              <SelectSearch
                search={true}
                options={getTimezoneSelectList()}
                value={timezoneSelect}
                placeholder="Choose timezone"
                onChange={(e) => onTimezoneChange(e.toString())}
                onBlur={() => {}}
                onFocus={() => {}}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={3}>
            <br />
            <Center>
              <CheckboxGroup
                colorScheme="blue"
                value={autoDailyClock}
                defaultValue={[]}
                onChange={onAutoDailyClockChange}
              >
                <Stack spacing={[1, 5]} direction={["column", "row"]}>
                  <Checkbox value="mo">Monday</Checkbox>
                  <Checkbox value="tu">Tuesday</Checkbox>
                  <Checkbox value="we">Wednesday</Checkbox>
                  <Checkbox value="th">Thursday</Checkbox>
                  <Checkbox value="fr">Friday</Checkbox>
                  <Checkbox value="sa">Saturday</Checkbox>
                  <Checkbox value="su">Sunday</Checkbox>
                </Stack>
              </CheckboxGroup>
            </Center>
            {/* <br />
            <Center>
              <Text>Choose days to auto clock</Text>
            </Center> */}
          </GridItem>
        </Grid>
        {props.data.id !== "" || (
          <Center>
            <Text
              fontSize="sm"
              textColor="#808080"
              // marginBottom="1rem"
              marginTop="1rem"
            >
              Auto Clock In has not been setup. Setup Now!
            </Text>
          </Center>
        )}
        <Flex align="center" justify="center">
          <Button
            type="submit"
            colorScheme={changes ? "green" : "blue"}
            marginTop="1rem"
          >
            Save Changes
          </Button>
        </Flex>
        {!changes || (
          <Center>
            <Text color="red" marginTop="0.75rem">
              There are unsaved changes
            </Text>
          </Center>
        )}
      </form>
    </>
  );
}

export default AutoClockSettingForm;
