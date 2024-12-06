import { Injectable } from '@nestjs/common';
import { DestinationsService } from 'src/destinations/destinations.service';
import { HotelService } from 'src/hotel/hotel.service';
import { NlpService } from 'src/nlp/nlp.service';
import { MethodService } from 'src/utils/method.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly hotelService: HotelService,
    private readonly nlpService: NlpService,
    private readonly destinationsService: DestinationsService,
    private readonly methodService: MethodService,
  ) {}

  /**
   * Get a recommendation based on a natural language input.
   * The recommendation type is determined by the intent of the input.
   * If the input does not specify a location, an error is returned.
   * If the input does not specify a price, the price is set to 0.
   * The response is an object with at least one of the following properties:
   * - hotels: An array of Hotel objects.
   * - destinations: An array of Destination objects.
   * @param text The natural language input.
   * @returns An object with the recommendation data, or an error message.
   */
  async getRecommendation(text: string) {
    const intent = await this.nlpService.classifyIntent(text);
    const { location } = await this.nlpService.extractEntities(text);
    const price = this.methodService.extractSinglePrice(text);
    const priceRange = this.methodService.extractPriceRange(text);

    if (!location) {
      return { error: 'Unable to extract a valid location' };
    }

    let response = {};

    console.log('Intent:', intent);
    switch (intent) {
      case 'hotel recommendation without price':
        this;
        response = {
          hotels: await this.hotelService.findHotelsByLocationsAndOrPrice(
            location,
            price,
          ),
          destinations: [],
          message: `Here are the best hotel recommendations in ${location}.`,
        };
        break;

      case 'hotel recommendation with price':
        response = {
          hotels: await this.hotelService.findHotelsByLocationsAndOrPrice(
            location,
            price,
          ),
          destinations: [],
          message: `Here are the best hotels in ${location} within your budget range of ${price}.`,
        };
        break;

      case 'hotel recommendation with price range':
        response = {
          hotels: await this.hotelService.findHotelsByLocationsAndPriceRange(
            location,
            priceRange,
          ),
          destinations: [],
          message: `Here are the best hotels in ${location} within your budget range of ${priceRange.minPrice} - ${priceRange.maxPrice}.`,
        };
        break;

      case 'destination recommendation':
        response = {
          destinations:
            await this.destinationsService.findDestinations(location),
          hotels: [],
          message: `Here are the top destinations in ${location} for you to explore.`,
        };
        break;

      case 'hotel and destination recommendation':
        response = {
          hotels: await this.hotelService.findHotelsByLocationsAndOrPrice(
            location,
            price,
          ),
          destinations:
            await this.destinationsService.findDestinations(location),
          message: `Here are the best hotels and destinations in ${location} for your stay.`,
        };
        break;

      default:
        return { error: 'Unable to determine recommendation type' };
    }

    return response;
  }
}
