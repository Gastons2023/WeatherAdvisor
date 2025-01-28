import dotenv from 'dotenv';
dotenv.config();

interface Coordinates{
  latitude: number,
longitude: number,
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
  }catch (error){
    console.error(error)
    throw error
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
  const {latitude, longitude, name, country, state} =locationData
  const coordinates: Coordinates = {
  latitude,
  longitude,
  name,
  country,
  state,
  }
  return coordinates
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geoCodeUrl= `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`
    return geoCodeUrl
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery= `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`
    return weatherQuery
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data)=>
      this.destructureLocationData(data))
    
    
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates)).then((res)=>res.json())
    console.log(response)
    const currentWeather: Weather= this.parseCurrentWeather(response.list[0])
    const buildForecast: Weather[]= this.buildForecastArray(currentWeather,response.list)
    return buildForecast
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
const currentWeather = new Weather(
  this.city,
  this.date,
  response.main.temp,
  response.wind.speed,
  response.main.humidity,
  response.weather[0].icon,
  response.weather[0].description,
)
return currentWeather
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
  const weatherForecast: Weather[]= {currentWeather}
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
    this.city = city
    console.log(city)
  }
}

export default new WeatherService();
