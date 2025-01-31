import dotenv from 'dotenv';
dotenv.config();

interface Coordinates{
lat: number,
lon: number,
name: string,
country: string,
state: string
}

class Weather{
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  
  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ){
this.city = city
this.date = date
this.icon = icon
this.iconDescription = iconDescription
this.tempF = tempF
this.windSpeed = windSpeed
this.humidity = humidity
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  
  private apiKey?: string;

  private city = ""
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  
  }

  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response: Coordinates[] = await fetch(query).then((res)=>res.json());
    console.log(response)
  return response[0]
  }catch (error:any){
    console.error(error)
    throw error
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
  const {lat, lon, name, country, state} =locationData
  const coordinates: Coordinates = {
  lat,
  lon,
  name,
  country,
  state,
  }
  return coordinates
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geoCodeUrl= `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`
    return geoCodeUrl
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery= `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
    return weatherQuery
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data)=>
      this.destructureLocationData(data))
    
    
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
      if (!response) {
        throw new Error('Weather data not found');
      }

      const currentWeather: Weather = this.parseCurrentWeather(
        response.list[0]
      );
      const forecast: Weather[] = this.buildForecastArray(
        currentWeather,
        response.list
      );
      return forecast;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const parseDate = new Date(response.dt*1000).
    toLocaleDateString();
const currentWeather = new Weather(
  this.city,
  parseDate,
  response.weather[0].icon,
  response.weather[0].description,
  response.main.temp,
  response.wind.speed,
  response.main.humidity,
 
)
return currentWeather
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[]= [currentWeather]
  const filteredWeatherData= weatherData.filter((data:any)=>{
    return data.dt_txt.includes('12:00:00');
  });
  for (const day of filteredWeatherData){
    weatherForecast.push(
      new Weather(
        this.city,
        new Date(day.dt * 1000).toLocaleDateString(),
        day.weather[0].icon,
        day.weather[0].description,
        day.main.temp,
        day.wind.speed,
        day.main.humidity,
      )
    );
  }
  return weatherForecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.city=city
      const coordinates = await this.fetchAndDestructureLocationData()
      if (coordinates){
        const weather = await this.fetchWeatherData(coordinates)
        return weather
      } 
    } catch (error) {
      
    }
  }
}

export default new WeatherService();
