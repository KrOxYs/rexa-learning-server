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
  async findHotelsByLocationsAndOrPrice(location: string, price?: number) {}
}
