import {
  Agenda,
  AvailabilitySearchParams,
  AvailabilitySearchResults,
  client as doctolibClient,
} from "../clients/doctolib";

export type Appointment = {
  placeName: string;
  date: string | null;
  url: string;
};

export type AppointmentService = {
  searchDentistAppointments(startDate: string): Promise<Appointment[]>;
  searchVaccinationAppointments(startDate: string): Promise<Appointment[]>;
};

function createAppointmentService(): AppointmentService {
  function isValidAgenda(agenda: Agenda, practiceIds: number[]): boolean {
    return (
      agenda.booking_disabled === false &&
      agenda.booking_temporary_disabled === false &&
      practiceIds.some((practiceId) => agenda.visit_motive_ids_by_practice_id[practiceId])
    );
  }

  function getAgendaIds(agendas: Agenda[], practiceIds: number[]): number[] {
    return agendas
      .filter((agenda) => isValidAgenda(agenda, practiceIds))
      .map((agenda) => agenda.id);
  }

  function getNextAvailableDate(searchResults: AvailabilitySearchResults): string | null {
    if (searchResults.total > 0) return searchResults.availabilities[0].date;
    if (searchResults.next_slot) return searchResults.next_slot;
    return null;
  }

  async function searchNextAvailableDate(
    agendaIds: number[],
    visitMotiveIds: number[],
    practiceIds: number[],
    startDate: string
  ): Promise<string | null> {
    const searchParams: AvailabilitySearchParams = {
      startDate,
      visitMotiveIds,
      agendaIds,
      insuranceSector: "public",
      practiceIds,
      limit: 3,
    };
    const searchResults = await doctolibClient.searchAvailabilities(searchParams);
    return getNextAvailableDate(searchResults);
  }

  async function searchAppointments(
    providerId: string,
    practiceIds: number[],
    startDate: string
  ): Promise<Appointment[]> {
    const provider = await doctolibClient.getHealthProvider(providerId);
    const { places } = provider.data;

    const appointments = await Promise.all(
      practiceIds.map(async (practiceId) => {
        const { visit_motives: visitMotives, agendas } = provider.data;
        const visitMotiveIds = visitMotives.map((visitMotive) => visitMotive.id);
        const agendaIds = getAgendaIds(agendas, [practiceId]);
        const date = await searchNextAvailableDate(
          agendaIds,
          visitMotiveIds,
          [practiceId],
          startDate
        );
        const url = `https://www.doctolib.de/institut/berlin/${providerId}?pid=practice-${practiceId}`;
        const place = places.find(({ practice_ids }) => practice_ids.includes(practiceId));
        return { placeName: place?.name as string, date, url };
      })
    );
    return appointments;
  }

  async function searchVaccinationAppointments(startDate: string): Promise<Appointment[]> {
    const providerId = "ciz-berlin-berlin";
    const practiceIds = [
      158431, // Arena Berlin,
      158434, // Messe Berlin/ Halle 21,
      158437, // Erika-Heß-Eisstadion,
      158435, // Velodrom Berlin,
      158436, // Flughafen Tegel,
      191611, // Flughafen Tempelhof (Moderna)
      191612, // Flughafen Tegel (Moderna)
    ];
    const appointments = await searchAppointments(providerId, practiceIds, startDate);
    return appointments;
  }

  async function searchDentistAppointments(startDate: string): Promise<Appointment[]> {
    const providerId = "medeco-braunschweig";
    const practiceIds = [141331];
    const appointments = await searchAppointments(providerId, practiceIds, startDate);
    return appointments;
  }

  return {
    searchVaccinationAppointments,
    searchDentistAppointments,
  };
}

export const appointmentService = createAppointmentService();
export default createAppointmentService;
