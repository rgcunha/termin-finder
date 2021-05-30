import {
  AvailabilitySearchParams,
  AvailabilitySearchResults,
  client as doctolibClient,
} from "../clients/doctolib";

export interface IAppointmentService {
  searchAvailabilities(): Promise<AvailabilitySearchResults>;
}

function createAppointmentService(): IAppointmentService {
  async function searchAvailabilities(): Promise<AvailabilitySearchResults> {
    const searchParams: AvailabilitySearchParams = {
      startDate: new Date().toISOString().split("T")[0],
      visitMotiveIds: [2836662],
      agendaIds: [469719],
      insuranceSector: "public",
      practiceIds: [162056],
      limit: 3,
    };
    const searchResults = await doctolibClient.searchAvailabilities(searchParams);
    return searchResults;
  }

  return {
    searchAvailabilities,
  };
}

export const appointmentService = createAppointmentService();
export default createAppointmentService;
