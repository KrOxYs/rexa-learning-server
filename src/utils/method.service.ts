import { Injectable } from '@nestjs/common';

@Injectable()
export class MethodService {
  constructor() {}

  /**
   * Extracts a single price in Indonesian Rupiah from a text.
   * The price can be in the format of 1.000, 1.000.000, 1 juta, or 1 ribu.
   * The method returns the price in the smallest unit (Rupiah) as a number.
   * If no price is found, the method returns null.
   * @param text The text to extract the price from.
   * @returns The extracted price in the smallest unit (Rupiah) as a number, or null if no price is found.
   */
  extractSinglePrice(text: string) {
    const priceMatch = text.match(/(\d{1,3}(?:\.\d{3})*)/); // Match prices like "800.000"

    let price = null;

    if (priceMatch) {
      let priceValue: any = priceMatch[1].replace(/\./g, ''); // Remove dot separators
      priceValue = parseInt(priceValue, 10); // Convert to an integer

      const isMillion = /juta/i.test(text); // Check if "juta" (million) is mentioned
      const isThousand = /ribu/i.test(text); // Check if "ribu" (thousand) is mentioned

      // Adjust the price value based on "juta" or "ribu"
      price = isMillion
        ? priceValue * 1000000
        : isThousand
          ? priceValue * 1000
          : priceValue;
    }

    console.log(`Extracted price: ${price}`);

    return price;
  }

  /**
   * Extracts a price range in Indonesian Rupiah from a text.
   * The price range can be in the format of "1 juta - 2 juta", "1 ribu - 2 ribu", or "1 juta sampai 2 juta".
   * The method returns an object with two properties: minPrice and maxPrice, which are the price range in the smallest unit (Rupiah) as numbers.
   * If no price range is found, the method returns null.
   * @param text The text to extract the price range from.
   * @returns An object with two properties: minPrice and maxPrice, which are the price range in the smallest unit (Rupiah) as numbers, or null if no price range is found.
   */
  extractPriceRange(text: string) {
    console.log('Extracting price range from:', text);

    // Regular expression to match a price range pattern (e.g., "800.000 juta sampai 1.500.000 juta")
    const rangePriceMatch = text.match(
      /(\d{1,3}(?:\.\d{3})*)\s*(juta|ribu)\s*(?:sampai|hingga)\s*(\d{1,3}(?:\.\d{3})*)\s*(juta|ribu)/i,
    );

    if (rangePriceMatch) {
      // Parse the minimum and maximum prices using the matching groups
      let minPrice = this.parsePrice(rangePriceMatch[1], rangePriceMatch[2]);
      let maxPrice = this.parsePrice(rangePriceMatch[3], rangePriceMatch[4]);

      // Ensure the minPrice is less than or equal to maxPrice
      if (minPrice > maxPrice) {
        const temp = minPrice;
        minPrice = maxPrice;
        maxPrice = temp;
      }

      console.log(
        `Extracted price range: minPrice=${minPrice}, maxPrice=${maxPrice}`,
      );
      return { minPrice, maxPrice };
    }

    console.log('No price range found in the text');
    return null;
  }

  /**
   * Helper function to parse price from string values like "juta" or "ribu".
   * @param priceStr The price as a string (e.g., '4', '5').
   * @param unit The unit (either 'juta' or 'ribu').
   * @returns The price in smallest unit (Rupiah).
   */
  private parsePrice(priceStr: string, unit: string) {
    let priceValue = parseInt(priceStr.replace(/\./g, ''), 10);
    if (/juta/i.test(unit)) {
      priceValue *= 1_000_000;
    } else if (/ribu/i.test(unit)) {
      priceValue *= 1_000;
    }
    return priceValue;
  }
}
