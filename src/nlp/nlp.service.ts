import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NlpService {
  // Define candidateLabels as a class property
  private candidateLabels = [
    'hotel recommendation with price', // New intent
    'hotel recommendation',
    'destination recommendation',
    'hotel and destination recommendation',
    'show hotels and destinations',
  ];

  /**
   * Classify the intent of a given natural language input.
   * @param text The natural language input.
   * @returns The intent of the input, as a string.
   * The intent is determined by a machine learning model, and can be one of the following:
   * - 'hotel recommendation'
   * - 'destination recommendation'
   * - 'hotel and destination recommendation'
   * - 'show hotels and destinations'
   * - 'hotel recommendation with price'
   */
  async classifyIntent(text: string) {
    console.log('Classifying intent:', text);
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
          inputs: text,
          parameters: { candidate_labels: this.candidateLabels }, // Use class property
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const labels = response.data.labels;

      console.log('Intent classification response:', response.data);

      if (
        labels[0] == 'hotel recommendation' &&
        labels[1] == 'hotel recommendation with price'
      ) {
        return (labels[0] = labels[1]);
      }

      return labels[0];
    } catch (error) {
      console.error('Intent classification error:', error.message);
      throw error;
    }
  }
  /**
   * Extracts a price in Indonesian Rupiah from a text.
   * The price can be in the format of 1.000, 1.000.000, 1 juta, or 1 ribu.
   * The method returns the price in the smallest unit (Rupiah) as a number.
   * If no price is found, the method returns null.
   * @param text The text to extract the price from.
   * @returns The extracted price in the smallest unit (Rupiah) as a number, or null if no price is found.
   */
  private extractPrice(text: string) {
    const priceMatch = text.match(/(\d{1,3}(?:\.\d{3})*)/);

    let price = null;

    if (priceMatch) {
      let priceValue: any = priceMatch[1].replace(/\./g, ''); // Remove dot separators
      priceValue = parseInt(priceValue, 10);

      const isMillion = /juta/i.test(text);
      const isThousand = /ribu/i.test(text);

      // Adjust the price value based on "juta" or "ribu"
      price = isMillion
        ? priceValue * 1000000
        : isThousand
          ? priceValue * 1000
          : priceValue;
    }
    return price;
  }
  /**
   * Extracts entities from a given text using the Hugging Face API.
   * Currently only extracts Location (LOC) entities.
   * Also extracts a price in Indonesian Rupiah from the text.
   * @param text The text to extract entities from.
   * @returns An object with two properties: location (a string, or null if no location is found), and price (a number, or null if no price is found).
   */
  async extractEntities(text: string) {
    console.log('Extracting entities from:', text);

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/xlm-roberta-large-finetuned-conll03-english',
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
      // console.log('Entity extraction response:', response);

      console.log('Entity extraction response:', response.data);
      const entities = response.data;

      // Extract only LOC (Location) entities
      const locations = entities
        .filter((entity: any) => entity.entity_group === 'LOC')
        .map((entity: any) => entity.word.trim());

      const location = locations.length > 0 ? locations[0] : null;

      // Extract price using regex or a similar function
      const price = this.extractPrice(text);

      return { location, price };
    } catch (error) {
      console.error('Entity extraction error:', error);
      return { location: null, price: null };
    }
  }
}
