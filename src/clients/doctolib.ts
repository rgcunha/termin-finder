import axios from "axios";

export type AvailabilitySearchParams = {
  startDate: string;
  visitMotiveIds: number[];
  agendaIds: number[];
  insuranceSector: "public" | "private";
  practiceIds: number[];
  limit: number;
};

export type AvailabilitySearchResults = {
  availabilities: Availability[];
  total: number;
  reason: string;
  message: string;
  next_slot?: string;
};

export type Availability = {
  date: string;
  slots: string[];
};

export type Practicioner = Record<string, unknown>;
export type Profile = Record<string, unknown>;
export type Speciality = Record<string, unknown>;
export type VisitMotiveCategory = Record<string, unknown>;
export type Place = {
  id: string;
  practice_ids: number[];
  city: string;
  name: string;
};
export type Agenda = {
  anonymous: boolean;
  booking_disabled: boolean;
  booking_temporary_disabled: boolean;
  equipment_temporary_disabled: boolean;
  id: number;
  insurance_sector_enabled: boolean;
  landline_number: string;
  organization_id: number;
  practice_id: number;
  practicioner_id: number;
  speciality_id: number;
  visit_motive_ids: number[];
  visit_motive_ids_by_practice_id: Record<number, number[]>;
  visit_motive_ids_only_for_doctors: number[];
};

export type VisitMotive = {
  id: number;
};

export type HealthProvider = {
  data: {
    agendas: Agenda[];
    availabilities_preview_compatible: boolean;
    has_new_patient_rule: boolean;
    places: Place[];
    practicioners: Practicioner[];
    profile: Profile;
    specialities: Speciality[];
    vaccination_center: boolean;
    visit_motive_categories: VisitMotiveCategory[];
    visit_motives: VisitMotive[];
  };
};

export interface IClient {
  searchAvailabilities({
    startDate,
    visitMotiveIds,
    agendaIds,
    insuranceSector,
    practiceIds,
    limit,
  }: AvailabilitySearchParams): Promise<AvailabilitySearchResults>;
  getHealthProvider(providerId: string): Promise<HealthProvider>;
}

function createClient(): IClient {
  const httpClient = axios.create();
  const baseUrl = process.env.DOCTOLIB_API_URL as string;

  async function sendRequest(url: string, params?: Record<string, unknown>) {
    try {
      const axiosResponse = await httpClient.get(url, { params });
      return axiosResponse.data;
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      throw err;
    }
  }

  function searchAvailabilities({
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
    return sendRequest(url, params);
  }

  function getHealthProvider(providerId: string): Promise<HealthProvider> {
    const path = `booking/${providerId}`;
    const url = `${baseUrl}/${path}.json`;
    return sendRequest(url);
  }

  return {
    searchAvailabilities,
    getHealthProvider,
  };
}

export const client = createClient();
export default createClient;
