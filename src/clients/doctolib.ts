import axios from "axios";

export interface AvailabilitySearchParams {
  startDate: string;
  visitMotiveIds: number[];
  agendaIds: number[];
  insuranceSector: "public" | "private";
  practiceIds: number[];
  limit: number;
}

export interface AvailabilitySearchResults {
  availabilities: Availability[];
  total: number;
  reason: string;
  message: string;
  next_slot?: string;
}

export interface Availability {
  date: string;
  slots: string[];
}

export interface IClient {
  searchAvailabilities({
    startDate,
    visitMotiveIds,
    agendaIds,
    insuranceSector,
    practiceIds,
    limit,
  }: AvailabilitySearchParams): Promise<AvailabilitySearchResults>;
}

function createClient(): IClient {
  const httpClient = axios.create();
  const baseUrl = process.env.DOCTOLIB_API_URL as string;

  async function searchAvailabilities({
    startDate,
    visitMotiveIds,
    agendaIds,
    insuranceSector,
    practiceIds,
    limit,
  }: AvailabilitySearchParams): Promise<AvailabilitySearchResults> {
    const path = "availabilities";
    const url = `${baseUrl}/${path}.json`;
    const params = {
      start_date: startDate,
      visit_motive_ids: visitMotiveIds.join("-"),
      agenda_ids: agendaIds.join("-"),
      insurance_sector: insuranceSector,
      practice_ids: practiceIds.join("-"),
      limit,
    };
    try {
      const axiosResponse = await httpClient.get(url, { params });
      return axiosResponse.data;
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      throw err;
    }
  }

  return {
    searchAvailabilities,
  };
}

export const client = createClient();
export default createClient;
