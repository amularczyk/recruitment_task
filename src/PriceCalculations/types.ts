import { ServiceType } from "../types"

export interface ICalculatePrice {
  calculatePrice: (selectedServices: ServiceType[]) => { basePrice: number, finalPrice: number }
}