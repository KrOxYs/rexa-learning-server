import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find hotels by location and/or price.
   * @param location The location to search for, case insensitive.
   * @param price The price to search for, defaults to 0 if not provided.
   * @returns A promise that resolves to an array of Hotel objects.
   */
  async findHotelsByLocationsAndOrPrice(location: string, price?: number) {
    console.log('Finding hotels by location:', location, 'and price:', price);
    return this.prisma.hotel.findMany({
      where: {
        address: { contains: location, mode: 'insensitive' },
        price: { gte: price ?? 0 },
      },
      take: 6,
    });
  }

  /**
   * Find hotels by location and price range.
   * @param location The location to search for, case insensitive.
   * @param price An object with two properties: minPrice and maxPrice, which are the price range in the smallest unit (Rupiah) as numbers.
   * @returns A promise that resolves to an array of Hotel objects, sorted by price in ascending order.
   */
  async findHotelsByLocationsAndPriceRange(location: string, price: any) {
    return this.prisma.hotel.findMany({
      where: {
        address: { contains: location, mode: 'insensitive' },
        price: { gte: price.minPrice, lte: price.maxPrice },
      },
      orderBy: {
        price: 'asc',
      },
      take: 6,
    });
  }
}
