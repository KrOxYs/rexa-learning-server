import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find destinations by location.
   * @param location The location to search for, case insensitive.
   * @returns A promise that resolves to an array of Destination objects.
   */
  async findDestinations(location: string) {
    return this.prisma.destinations.findMany({
      where: { location: { contains: location, mode: 'insensitive' } },
      take: 6,
    });
  }
}
