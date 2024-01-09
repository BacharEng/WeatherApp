import apiClient from "./services/api-client";
import {
  HStack,
  Box,
  Text,
  Image,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function App() {
  // http://api.weatherapi.com/v1/forecast.json?key=7a2ed8bfacc04835a45144307240901&q=Tel%20Aviv&days=7&aqi=no&alerts=no
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState<Current | null>(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState<Location | null>();
  const [days, setDays] = useState(7);
  const [city, setCity] = useState("Detroit");

  interface Current {
    gust_kph: string;
    feelslike_c: string;
    humidity: string;
    last_updated: string;
    temp_c: string;
    wind_kph: string;
    precip_in: string;
    condition: Condition;
  }

  interface Forecast {
    gust_kph: string;
    feelslike_c: string;
    humidity: string;
    last_updated: string;
    temp_c: string;
    wind_kph: string;
  }

  interface Location {
    country: string;
    region: string;
    name: string;
  }

  interface Condition {
    icon: string;
    text: string;
  }

  //http://api.weatherapi.com/v1/forecast.json?key=7a2ed8bfacc04835a45144307240901&q=Tel Aviv&days=7&aqi=no&alerts=no
  const getData = async () => {
    setIsLoading(true);
    const response = await apiClient
      .get(
        `/forecast.json?key=7a2ed8bfacc04835a45144307240901&q=${city}&days=${days}&aqi=no&alerts=no`
      )
      .then((response) => {
        setCurrent(response.data.current);
        setForecast(response.data.forecast.forecastday);
        setLocation(response.data.location);
        console.log(response.data);
        console.log(response.data.current);
        console.log(response.data.forecast.forecastday);
        console.log(response.data.location);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <VStack>
        <Input
          htmlSize={72}
          width="auto"
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
        />
        <Button onClick={() => getData()} colorScheme="cyan">
          Change city
        </Button>
      </VStack>
      <HStack spacing="24px">
        <Box>{`${location?.name} | ${location?.country}`}</Box>
        <Box>{`Chance of rain: ${current?.precip_in}%`}</Box>
      </HStack>
      <HStack>
        <Box>{`${current?.condition.text}`}</Box>
        <Image
          borderRadius="full"
          boxSize="30px"
          objectFit="cover"
          src={`${current?.condition.icon}`}
        />
        <Box></Box>
      </HStack>
      <HStack spacing="24px">
        <Box>{`Last updated: ${current?.last_updated}`}</Box>
        <Box>{`Wind speed is: ${current?.wind_kph}kmh`}</Box>
        <Box>{`Temperture is: ${current?.temp_c}°`}</Box>
        <Box>{`Humidity is: ${current?.humidity}`}</Box>
      </HStack>
    </>
  );
}

export default App;
