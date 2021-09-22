import { Seat } from '.'

export const getSeatById = (seats: Array<Seat>, id: number) => {
  return seats.find(role => role.seatTypeId === id)?.seatTypeName
}
