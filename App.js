import React from "react";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "4c04a3f247bafd4fd704bebe68d27172";
const AIR_CONDITION_API_KEY =
  "YKtY9xfGdnnPBDx3biOd%2BUAFxTnMnIZEaofdHiNDcO%2Beeqo4hXTI4EaE2WE4o6AvrEOIX0Cv8CawTlgXeH0QNA%3D%3D";

export default class extends React.Component {
  state = {
    isLoading: true,
  };

  getWeather = async (lat, lon) => {
    //console.log(lat, lon);
    const weatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    // const { data: { main: { temp }, weather[weatherOptions] } = await axios.get(weatherAPI);
    const { data } = await axios.get(weatherAPI);
    const {
      main: { temp },
      // weather: [{ ...weatherOptions }],
      weather: [{ main: condition }],
      name,
    } = data;
    //console.log(temp, weatherOptions);
    console.log(data);
    return {
      name,
      condition,
      temp: Math.floor(temp / 10),
    };
  };

  getAirCondition = async ({ name, condition, temp }) => {
    const airAPI = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst?serviceKey=${AIR_CONDITION_API_KEY}&numOfRows=100&pageNo=1&sidoName=%EA%B2%BD%EA%B8%B0&searchCondition=HOUR&_returnType=json`;

    try {
      const {
        data: { list },
      } = await axios.get(airAPI);

      const [result] = list
        .filter((item) => item.cityNameEng === name)
        .map((item) => ({
          pm10Value: item.pm10Value,
          pm25Value: item.pm25Value,
        }));
      //console.log("what");
      //console.log(result);

      this.setState({
        isLoading: false,
        airCondition: result,
        condition,
        temp,
      });

      //console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  getLocation = async () => {
    try {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      //console.log(latitude, longitude);

      const weatherInfo = await this.getWeather(latitude, longitude);
      await this.getAirCondition(weatherInfo);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, condition, temp, airCondition } = this.state;
    console.log(condition, temp, airCondition);
    return isLoading ? (
      <Loading />
    ) : (
      <Weather condition={condition} temp={temp} air={airCondition} />
    );
    //return isLoading ? <Loading /> : null;
  }
}
