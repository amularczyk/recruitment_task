import { ICalculatePrice } from "./types"
import { PriceCalculatorFor2020 } from './priceCalculatorFor2020'
import { PriceCalculatorFor2021 } from './priceCalculatorFor2021'
import { PriceCalculatorFor2022 } from './priceCalculatorFor2022'
import { ServiceYear, ServiceYearConst } from "../types"

const Prices: ICalculatePrice[] = []
Prices[ServiceYearConst[2020]] = new PriceCalculatorFor2020()
Prices[ServiceYearConst[2021]] = new PriceCalculatorFor2021()
Prices[ServiceYearConst[2022]] = new PriceCalculatorFor2022()

export const getCorrectPriceCalculator = (selectedYear: ServiceYear) => Prices[selectedYear]