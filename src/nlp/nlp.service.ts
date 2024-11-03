import { Injectable } from '@nestjs/common';
import axios from 'axios';

/** Rexa.ai NLP service   */

@Injectable()
export class NlpService {
  // Define candidateLabels as a class property
  private candidateLabels = [
    'hotel recommendation with price range',
    'hotel recommendation with price', // New intent
    'hotel recommendation without price',
    'destination recommendation',
    'hotel and destination recommendation without price',
    'show hotels and destinations without price',
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
        labels[0] == 'hotel recommendation with price' &&
        labels[1] == 'hotel recommendation with price range'
      ) {
        return (labels[0] = labels[1]);
      }

      if (
        labels[0] == 'hotel recommendation without price' &&
        labels[1] == 'hotel recommendation with price'
      ) {
        return (labels[0] = labels[1]);
      }

      console.log('Intent classification labels:', labels);

      return labels[0];
    } catch (error) {
      console.error('Intent classification error:', error.message);
      throw error;
    }
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

      return { location };
    } catch (error) {
      console.error('Entity extraction error:', error);
      return { location: null, price: null };
    }
  }
}
